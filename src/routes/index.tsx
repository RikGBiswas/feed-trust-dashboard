import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Database,
  Building2,
  Shield,
  EyeOff,
  Send,
  Ticket,
  ServerCog,
  PlusCircle,
  Layers,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { KPICard } from "@/components/KPICard";
import { FilterBar, emptyFilters, type Filters } from "@/components/FilterBar";
import { FeedTable } from "@/components/FeedTable";
import { getFeeds, getFeedKpis, type Feed, type FeedKpis } from "@/api/feedApi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feed Inventory — CoAction" },
      {
        name: "description",
        content:
          "Browse, filter, and manage enterprise data feeds across CoAction and third-party sources.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [kpis, setKpis] = useState<FeedKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [feedData, kpiData] = await Promise.all([getFeeds(), getFeedKpis()]);
      setFeeds(feedData);
      setKpis(kpiData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch data every time the page becomes visible (e.g. after edit navigation)
  const mountCount = useRef(0);
  useEffect(() => {
    mountCount.current += 1;
    loadData();
  }, [loadData]);

  // Also listen for browser tab visibility changes
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") loadData();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadData]);

  const normalizeDomain = (d: string) => {
    const lower = d.trim().toLowerCase();
    if (lower === "claim" || lower === "claims") return "Claims";
    return d.trim();
  };
  const businessDomains = useMemo(
    () => Array.from(new Set(feeds.map((f) => normalizeDomain(f.businessDomain)).filter(Boolean))).sort(),
    [feeds],
  );
  const feedTypes = useMemo(
    () => Array.from(new Set(feeds.map((f) => f.feedType).filter(Boolean))).sort(),
    [feeds],
  );
  const transferMethods = useMemo(
    () => Array.from(new Set(feeds.map((f) => f.transferMethod).filter(Boolean))).sort(),
    [feeds],
  );
  const dataSources = useMemo(
    () => Array.from(new Set(feeds.map((f) => f.dataSource).filter(Boolean))).sort(),
    [feeds],
  );
  const environments = useMemo(
    () => Array.from(new Set(feeds.map((f) => f.environment).filter(Boolean))).sort(),
    [feeds],
  );

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return feeds.filter((f) => {
      if (filters.businessDomain && normalizeDomain(f.businessDomain) !== filters.businessDomain) return false;
      if (filters.dataSource) {
        if (filters.dataSource === "__coaction__") {
          if (f.dataSource.toLowerCase() !== "coaction") return false;
        } else if (filters.dataSource === "__thirdparty__") {
          if (f.dataSource.toLowerCase() === "coaction") return false;
        } else {
          if (f.dataSource !== filters.dataSource) return false;
        }
      }
      if (filters.feedType && f.feedType !== filters.feedType) return false;
      if (filters.transferMethod && f.transferMethod !== filters.transferMethod) return false;
      if (filters.environment && f.environment !== filters.environment) return false;
      if (filters.containsPII && f.containsPII !== filters.containsPII) return false;
      if (filters.masking && f.masking !== filters.masking) return false;
      if (filters.provisionedToGP && f.provisionedToGP !== filters.provisionedToGP) return false;
      if (q) {
        const hay =
          `${f.feedId} ${f.feedName} ${f.feedDescription} ${f.vendorPartner} ${f.dataOwner} ${f.productOwner} ${f.sourceSystem}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filters, feeds]);

  const total = kpis?.totalFeeds ?? 0;
  const pct = (n: number) => (total === 0 ? "0%" : `${Math.round((n / total) * 100)}% of total`);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">Loading feeds…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <button
          onClick={loadData}
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-95 flex items-center gap-1.5"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feed Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse, filter, and manage enterprise data feeds across CoAction and third-party sources.</p>
        </div>
        <Link
          to="/add-feed"
          className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-95 flex items-center gap-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          Add Feed
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        <KPICard label="Total Feeds" value={kpis?.totalFeeds ?? 0} hint="All registered feeds" icon={Database} tone="info" />
        <KPICard label="Third Party Feeds" value={kpis?.thirdPartyFeeds ?? 0} hint={pct(kpis?.thirdPartyFeeds ?? 0)} icon={Building2} tone="default" />
        <KPICard label="CoAction Internal" value={kpis?.coactionInternalFeeds ?? 0} hint={pct(kpis?.coactionInternalFeeds ?? 0)} icon={Layers} tone="default" />
        <KPICard label="Feeds with PII" value={kpis?.feedsWithPii ?? 0} hint={pct(kpis?.feedsWithPii ?? 0)} icon={Shield} tone="destructive" />
        <KPICard label="Masked Feeds" value={kpis?.maskedFeeds ?? 0} hint={pct(kpis?.maskedFeeds ?? 0)} icon={EyeOff} tone="warning" />
        <KPICard label="Provisioned to GP" value={kpis?.feedsProvisionedToGp ?? 0} hint={pct(kpis?.feedsProvisionedToGp ?? 0)} icon={Send} tone="success" />
        <KPICard label="Feeds with JIRA" value={kpis?.feedsWithJira ?? 0} hint={pct(kpis?.feedsWithJira ?? 0)} icon={Ticket} tone="info" />
        <KPICard label="SFTP Feeds" value={kpis?.sftpFeeds ?? 0} hint={pct(kpis?.sftpFeeds ?? 0)} icon={ServerCog} tone="default" />
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        options={{ businessDomain: businessDomains, feedType: feedTypes, transferMethod: transferMethods, dataSource: dataSources, environment: environments }}
        onExport={() => {
          const fmtDate = (v: string | null | undefined) => { if (!v) return ""; const d = new Date(v); return isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
          const headers = ["Feed ID","Feed Name","Description","Feed Type","Business Domain","Data Owner","Product Owner","Data Source","Source System","Vendor/Partner","Transfer Method","File Format","Encryption","Contains PII","Masking","Credentials","Access","Provisioned to GP","Date Provisioned","JIRA","Version","Environment","Last Change Date","Comments"];
          const rows = filtered.map(f => [f.feedId,f.feedName,f.feedDescription,f.feedType,f.businessDomain,f.dataOwner,f.productOwner,f.dataSource,f.sourceSystem,f.vendorPartner,f.transferMethod,f.fileFormat,f.encryption,f.containsPII,f.masking,f.credentials,f.access,f.provisionedToGP,fmtDate(f.dateProvisioned),f.jira,f.version,f.environment,fmtDate(f.lastChangeDate),f.comments]);
          const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${(v ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `feed-inventory-${new Date().toISOString().slice(0,10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success(`Exported ${filtered.length} feeds as CSV.`);
        }}
        onExportPdf={() => {
          const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
          doc.setFontSize(14);
          doc.text("Feed Inventory Dashboard — Growth Protocol", 40, 30);
          doc.setFontSize(9);
          doc.setTextColor(100);
          doc.text(`Generated: ${new Date().toLocaleString()} | ${filtered.length} feeds`, 40, 44);
          doc.setTextColor(0);

          const fmtDate = (v: string | null | undefined) => { if (!v) return ""; const d = new Date(v); return isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
          const headers = ["Feed ID","Feed Name","Description","Feed Type","Business Domain","Data Owner","Product Owner","Data Source","Source System","Vendor/Partner","Transfer Method","File Format","Encryption","Contains PII","Masking","Credentials","Access","Provisioned to GP","Date Provisioned","JIRA","Version","Environment","Last Change Date","Comments"];
          const rows = filtered.map(f => [f.feedId,f.feedName,f.feedDescription,f.feedType,f.businessDomain,f.dataOwner,f.productOwner,f.dataSource,f.sourceSystem,f.vendorPartner,f.transferMethod,f.fileFormat,f.encryption,f.containsPII,f.masking,f.credentials,f.access,f.provisionedToGP,fmtDate(f.dateProvisioned),f.jira,f.version,f.environment,fmtDate(f.lastChangeDate),f.comments]);

          autoTable(doc, {
            startY: 56,
            head: [headers],
            body: rows,
            styles: { fontSize: 5.5, cellPadding: 2 },
            headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold", fontSize: 5.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: 20, right: 20 },
          });

          doc.save(`feed-inventory-${new Date().toISOString().slice(0,10)}.pdf`);
          toast.success(`Exported ${filtered.length} feeds as PDF.`);
        }}
      />

      <FeedTable rows={filtered} />
    </div>
  );
}
