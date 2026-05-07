import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, Search, Eye, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import { getApiEntries, updateApiEntry, type ApiEntry } from "@/api/integrationsApi";
import { Pill } from "@/components/Badge";

export const Route = createFileRoute("/api-library")({
  head: () => ({
    meta: [
      { title: "API Library — CoAction" },
      { name: "description", content: "Catalog of APIs used for data extraction and integration." },
    ],
  }),
  component: ApiLibraryPage,
});

const tableColumns: { key: keyof ApiEntry; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "sourceOwner", label: "Source Owner" },
  { key: "sourceType", label: "Source Type" },
  { key: "dataSource", label: "Data Source" },
  { key: "integrationType", label: "Integration Type" },
  { key: "targetOwner", label: "Target Owner" },
  { key: "targetType", label: "Target Type" },
  { key: "target", label: "Target" },
  { key: "status", label: "Status" },
  { key: "domain", label: "Domain" },
  { key: "pointOfContact", label: "Contact" },
];

const allFields: { key: keyof ApiEntry; label: string; full?: boolean }[] = [
  { key: "rowNum", label: "#" },
  { key: "exportable", label: "Exportable?" },
  { key: "rowType", label: "Row Type" },
  { key: "match", label: "Match?" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description", full: true },
  { key: "sourceOwner", label: "Source Owner" },
  { key: "sourceType", label: "Source Type" },
  { key: "dataSource", label: "Data Source" },
  { key: "integrationType", label: "Integration Type" },
  { key: "targetOwner", label: "Target Owner" },
  { key: "targetType", label: "Target Type" },
  { key: "target", label: "Target" },
  { key: "status", label: "Status" },
  { key: "domain", label: "Domain" },
  { key: "pointOfContact", label: "Point of Contact" },
  { key: "origin", label: "Origin" },
  { key: "questions", label: "Questions", full: true },
  { key: "notes", label: "Notes", full: true },
];

function ApiLibraryPage() {
  const [data, setData] = useState<ApiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [viewItem, setViewItem] = useState<ApiEntry | null>(null);
  const [editItem, setEditItem] = useState<ApiEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getApiEntries();
      setData(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const statuses = useMemo(
    () => Array.from(new Set(data.map((d) => d.status).filter(Boolean))).sort(),
    [data],
  );
  const domains = useMemo(
    () => Array.from(new Set(data.map((d) => d.domain).filter(Boolean))).sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false;
      if (domainFilter && row.domain !== domainFilter) return false;
      if (q) {
        const hay = `${row.name} ${row.description} ${row.sourceOwner} ${row.dataSource} ${row.target} ${row.domain} ${row.pointOfContact}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, search, statusFilter, domainFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = useMemo(
    () => filtered.slice(start, start + pageSize),
    [filtered, start, pageSize],
  );

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      const updated = await updateApiEntry(editItem.id, editItem);
      setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setEditItem(null);
      toast.success("API entry updated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">Loading API library…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={loadData} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-95 flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">API Library</h1>
        <p className="text-sm text-muted-foreground mt-1">Catalog of APIs used to extract data for the portal.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-lg p-3 shadow-card">
        <select
          className="h-9 rounded-md border border-input bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          value={domainFilter}
          onChange={(e) => { setDomainFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Domains</option>
          {domains.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-input bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search APIs…"
            className="w-full h-9 pl-8 pr-3 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} of {data.length} records</span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[620px] overflow-y-auto">
            <table className="min-w-full text-sm border-separate border-spacing-0">
              <thead className="sticky top-0 z-10 bg-table-header">
                <tr>
                  {tableColumns.map((c) => (
                    <th key={c.key} className="text-left font-semibold text-xs uppercase tracking-wide text-muted-foreground px-3 py-2.5 border-b border-border whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                  <th className="text-left font-semibold text-xs uppercase tracking-wide text-muted-foreground px-3 py-2.5 border-b border-border w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row, i) => (
                  <tr key={row.id} className={`${i % 2 === 1 ? "bg-secondary/40" : "bg-card"} hover:bg-accent/60 transition-colors`}>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap font-medium text-foreground max-w-[200px] truncate">
                      {row.name}
                    </td>
                    <td className="px-3 py-2 border-b border-border text-muted-foreground max-w-[250px]">
                      <span className="line-clamp-2">{row.description}</span>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap text-muted-foreground">
                      {row.sourceOwner}
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant="neutral">{row.sourceType}</Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap font-medium text-foreground">
                      {row.dataSource}
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant="info">{row.integrationType}</Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap text-muted-foreground">
                      {row.targetOwner}
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant="neutral">{row.targetType}</Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap font-medium text-foreground">
                      {row.target}
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant={row.status === "Active" ? "success" : row.status === "Inactive" ? "destructive" : "warning"}>
                        {row.status}
                      </Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant="primary">{row.domain}</Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap text-muted-foreground">
                      {row.pointOfContact}
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setViewItem(row)} className="h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center" aria-label="View">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => setEditItem({ ...row })} className="h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center" aria-label="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={tableColumns.length + 1} className="px-3 py-12 text-center text-sm text-muted-foreground">
                      No APIs match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 border-t border-border bg-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="h-7 rounded-md border border-input bg-card px-1.5 text-xs"
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span>
              {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, filtered.length)} of {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 px-2 text-xs rounded-md border border-input bg-card hover:bg-accent disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs text-muted-foreground tabular-nums px-2">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 px-2 text-xs rounded-md border border-input bg-card hover:bg-accent disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50" onClick={() => setViewItem(null)}>
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{viewItem.name}</h2>
                <p className="text-xs text-muted-foreground">{viewItem.domain} — {viewItem.status}</p>
              </div>
              <button type="button" onClick={() => setViewItem(null)} className="h-8 w-8 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="border border-border rounded-lg">
                <div className="px-4 py-2 border-b border-border bg-secondary/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">General</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ViewField label="#" value={String(viewItem.rowNum || "")} />
                  <ViewField label="Exportable?" value={viewItem.exportable} />
                  <ViewField label="Row Type" value={viewItem.rowType} />
                  <ViewField label="Match?" value={viewItem.match} />
                  <ViewField label="Name" value={viewItem.name} full />
                  <ViewField label="Description" value={viewItem.description} full />
                </div>
              </div>
              <div className="border border-border rounded-lg">
                <div className="px-4 py-2 border-b border-border bg-secondary/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Source & Target</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ViewField label="Source Owner" value={viewItem.sourceOwner} />
                  <ViewField label="Source Type" value={viewItem.sourceType} />
                  <ViewField label="Data Source" value={viewItem.dataSource} />
                  <ViewField label="Integration Type" value={viewItem.integrationType} />
                  <ViewField label="Target Owner" value={viewItem.targetOwner} />
                  <ViewField label="Target Type" value={viewItem.targetType} />
                  <ViewField label="Target" value={viewItem.target} />
                </div>
              </div>
              <div className="border border-border rounded-lg">
                <div className="px-4 py-2 border-b border-border bg-secondary/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Metadata</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ViewField label="Status" value={viewItem.status} />
                  <ViewField label="Domain" value={viewItem.domain} />
                  <ViewField label="Point of Contact" value={viewItem.pointOfContact} />
                  <ViewField label="Origin" value={viewItem.origin} />
                  <ViewField label="Questions" value={viewItem.questions} full />
                  <ViewField label="Notes" value={viewItem.notes} full />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50" onClick={() => setEditItem(null)}>
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Edit API Entry</h2>
              <button type="button" onClick={() => setEditItem(null)} className="h-8 w-8 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {allFields.map((c) => (
                <div key={c.key} className={c.full ? "md:col-span-2" : ""}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{c.label}</label>
                  {c.full ? (
                    <textarea
                      value={String(editItem[c.key] ?? "")}
                      onChange={(e) => setEditItem({ ...editItem, [c.key]: c.key === "rowNum" ? Number(e.target.value) || 0 : e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 resize-y"
                    />
                  ) : (
                    <input
                      type={c.key === "rowNum" ? "number" : "text"}
                      value={String(editItem[c.key] ?? "")}
                      onChange={(e) => setEditItem({ ...editItem, [c.key]: c.key === "rowNum" ? Number(e.target.value) || 0 : e.target.value })}
                      className="w-full h-9 px-3 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="h-9 px-4 rounded-md border border-input bg-card text-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-95 flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewField({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <dt className="text-xs font-medium text-muted-foreground mb-0.5">{label}</dt>
      <dd className="text-sm text-foreground whitespace-pre-wrap">{value || "—"}</dd>
    </div>
  );
}
