import { Download, Search, SlidersHorizontal } from "lucide-react";

export type Filters = {
  businessDomain: string;
  dataSource: string;
  feedType: string;
  transferMethod: string;
  containsPII: string;
  masking: string;
  provisionedToGP: string;
  search: string;
};

export const emptyFilters: Filters = {
  businessDomain: "",
  dataSource: "",
  feedType: "",
  transferMethod: "",
  containsPII: "",
  masking: "",
  provisionedToGP: "",
  search: "",
};

const selectClass =
  "h-9 rounded-md border border-input bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring";

export function FilterBar({
  filters,
  onChange,
  options,
  onExport,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  options: {
    businessDomain: string[];
    feedType: string[];
  };
  onExport: () => void;
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    onChange({ ...filters, [k]: v });

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className={selectClass}
          value={filters.businessDomain}
          onChange={(e) => set("businessDomain", e.target.value)}
        >
          <option value="">Business Domain</option>
          {options.businessDomain.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.dataSource}
          onChange={(e) => set("dataSource", e.target.value)}
        >
          <option value="">Data Source</option>
          <option>CoAction</option>
          <option>Third Party</option>
        </select>
        <select
          className={selectClass}
          value={filters.feedType}
          onChange={(e) => set("feedType", e.target.value)}
        >
          <option value="">Feed Type</option>
          {options.feedType.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.transferMethod}
          onChange={(e) => set("transferMethod", e.target.value)}
        >
          <option value="">Transfer Method</option>
          <option>SFTP</option>
          <option>API</option>
          <option>Other</option>
        </select>
        <select
          className={selectClass}
          value={filters.containsPII}
          onChange={(e) => set("containsPII", e.target.value)}
        >
          <option value="">Contains PII</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <select
          className={selectClass}
          value={filters.masking}
          onChange={(e) => set("masking", e.target.value)}
        >
          <option value="">Masking</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <select
          className={selectClass}
          value={filters.provisionedToGP}
          onChange={(e) => set("provisionedToGP", e.target.value)}
        >
          <option value="">Provisioned to GP</option>
          <option>Yes</option>
          <option>No</option>
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search feeds, vendors, owners…"
            className="w-full h-9 pl-8 pr-3 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring"
          />
        </div>

        <button
          type="button"
          className="h-9 px-2.5 rounded-md border border-input bg-card text-sm text-foreground hover:bg-accent flex items-center gap-1.5"
          aria-label="Filter settings"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onExport}
          className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-95 flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}
