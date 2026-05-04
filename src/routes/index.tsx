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
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { KPICard } from "@/components/KPICard";
import { FilterBar, emptyFilters, type Filters } from "@/components/FilterBar";
import { FeedTable } from "@/components/FeedTable";
import { mockFeeds } from "@/lib/mock-feeds";

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

  const businessDomains = useMemo(
    () => Array.from(new Set(mockFeeds.map((f) => f.businessDomain))).sort(),
    [],
  );
  const feedTypes = useMemo(
    () => Array.from(new Set(mockFeeds.map((f) => f.feedType))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return mockFeeds.filter((f) => {
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
  }, [filters]);

  const kpis = useMemo(() => {
    const total = mockFeeds.length;
    const third = mockFeeds.filter((f) => f.dataSource === "Third Party").length;
    const internal = mockFeeds.filter((f) => f.dataSource === "CoAction").length;
    const pii = mockFeeds.filter((f) => f.containsPII === "Yes").length;
    const masked = mockFeeds.filter((f) => f.masking === "Yes").length;
    const provisioned = mockFeeds.filter((f) => f.provisionedToGP === "Yes").length;
    const jira = mockFeeds.filter((f) => f.jira && f.jira.trim().length > 0).length;
    const sftp = mockFeeds.filter((f) => f.transferMethod === "SFTP").length;
    const pct = (n: number) => (total === 0 ? "0%" : `${Math.round((n / total) * 100)}% of total`);
    return { total, third, internal, pii, masked, provisioned, jira, sftp, pct };
  }, []);

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
        <KPICard label="Total Feeds" value={kpis.total} hint="All registered feeds" icon={Database} tone="info" />
        <KPICard label="Third Party Feeds" value={kpis.third} hint={kpis.pct(kpis.third)} icon={Building2} tone="default" />
        <KPICard label="CoAction Internal" value={kpis.internal} hint={kpis.pct(kpis.internal)} icon={Layers} tone="default" />
        <KPICard label="Feeds with PII" value={kpis.pii} hint={kpis.pct(kpis.pii)} icon={Shield} tone="destructive" />
        <KPICard label="Masked Feeds" value={kpis.masked} hint={kpis.pct(kpis.masked)} icon={EyeOff} tone="warning" />
        <KPICard label="Provisioned to GP" value={kpis.provisioned} hint={kpis.pct(kpis.provisioned)} icon={Send} tone="success" />
        <KPICard label="Feeds with JIRA" value={kpis.jira} hint={kpis.pct(kpis.jira)} icon={Ticket} tone="info" />
        <KPICard label="SFTP Feeds" value={kpis.sftp} hint={kpis.pct(kpis.sftp)} icon={ServerCog} tone="default" />
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
