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
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { KPICard } from "@/components/KPICard";
import { FilterBar, emptyFilters, type Filters } from "@/components/FilterBar";
import { FeedTable } from "@/components/FeedTable";
import { getFeeds, getFeedKpis, type Feed, type FeedKpis } from "@/api/feedApi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feed Inventory — CoAction DataTrust" },
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const businessDomains = useMemo(
    () => Array.from(new Set(feeds.map((f) => f.businessDomain))).sort(),
    [feeds],
  );
  const feedTypes = useMemo(
    () => Array.from(new Set(feeds.map((f) => f.feedType))).sort(),
    [feeds],
  );

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return feeds.filter((f) => {
      if (filters.businessDomain && f.businessDomain !== filters.businessDomain) return false;
      if (filters.dataSource && f.dataSource !== filters.dataSource) return false;
      if (filters.feedType && f.feedType !== filters.feedType) return false;
      if (filters.transferMethod && f.transferMethod !== filters.transferMethod) return false;
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Feed Inventory Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Catalog of all data feeds across CoAction and third-party sources.
          </p>
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
        options={{ businessDomain: businessDomains, feedType: feedTypes }}
        onExport={() => toast.success(`Exported ${filtered.length} feeds (mock).`)}
      />

      <FeedTable rows={filtered} />
    </div>
  );
}
