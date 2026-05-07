import { ChevronDown, Download, FileText, FileSpreadsheet, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Filters = {
  businessDomain: string;
  dataSource: string;
  feedType: string;
  transferMethod: string;
  environment: string;
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
  environment: "",
  containsPII: "",
  masking: "",
  provisionedToGP: "",
  search: "",
};

const selectClass =
  "h-9 rounded-md border border-input bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring";

/* ── tiny hook to close a dropdown on outside click ── */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, close]);
}

export function FilterBar({
  filters,
  onChange,
  options,
  onExport,
  onExportPdf,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  options: {
    businessDomain: string[];
    feedType: string[];
    transferMethod: string[];
    dataSource: string[];
    environment: string[];
  };
  onExport: () => void;
  onExportPdf: () => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useClickOutside(filterRef, () => setShowFilters(false));
  useClickOutside(exportRef, () => setShowExport(false));

  const bd = options?.businessDomain ?? [];
  const ds = options?.dataSource ?? [];
  const ft = options?.feedType ?? [];
  const tm = options?.transferMethod ?? [];
  const env = options?.environment ?? [];

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    onChange({ ...filters, [k]: v });

  const activeFilterCount = [
    filters.containsPII,
    filters.masking,
    filters.provisionedToGP,
  ].filter(Boolean).length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className={selectClass}
          value={filters.businessDomain}
          onChange={(e) => set("businessDomain", e.target.value)}
        >
          <option value="">Business Domain</option>
          {bd.map((o) => (
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
          <option value="__coaction__">Coaction</option>
          <option value="__thirdparty__">Third Party</option>
          <optgroup label="Specific">
            {ds.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </optgroup>
        </select>
        <select
          className={selectClass}
          value={filters.feedType}
          onChange={(e) => set("feedType", e.target.value)}
        >
          <option value="">Feed Type</option>
          {ft.map((o) => (
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
          {tm.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.environment}
          onChange={(e) => set("environment", e.target.value)}
        >
          <option value="">Environment</option>
          {env.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
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

        {/* ── More Filters dropdown ─────────────────────── */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => { setShowFilters(!showFilters); setShowExport(false); }}
            className={`h-9 px-2.5 rounded-md border border-input text-sm hover:bg-accent flex items-center gap-1.5 ${showFilters ? "bg-accent text-foreground" : "bg-card text-foreground"}`}
            aria-label="More filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-64 rounded-lg border border-border bg-card shadow-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Additional Filters</span>
                <button type="button" onClick={() => { onChange(emptyFilters); setShowFilters(false); }} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear
                </button>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Contains PII</label>
                <select className={selectClass + " w-full"} value={filters.containsPII} onChange={(e) => set("containsPII", e.target.value)}>
                  <option value="">All</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Masking</label>
                <select className={selectClass + " w-full"} value={filters.masking} onChange={(e) => set("masking", e.target.value)}>
                  <option value="">All</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Provisioned to GP</label>
                <select className={selectClass + " w-full"} value={filters.provisionedToGP} onChange={(e) => set("provisionedToGP", e.target.value)}>
                  <option value="">All</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ── Export dropdown ───────────────────────────── */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            onClick={() => { setShowExport(!showExport); setShowFilters(false); }}
            className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-95 flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showExport ? "rotate-180" : ""}`} />
          </button>

          {showExport && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-44 rounded-lg border border-border bg-card shadow-lg py-1">
              <button
                type="button"
                onClick={() => { onExport(); setShowExport(false); }}
                className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                Export as CSV
              </button>
              <button
                type="button"
                onClick={() => { onExportPdf(); setShowExport(false); }}
                className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent flex items-center gap-2"
              >
                <FileText className="h-4 w-4 text-red-500" />
                Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
