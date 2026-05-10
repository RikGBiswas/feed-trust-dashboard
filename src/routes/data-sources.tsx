import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, Search, Eye, Pencil, X, Save, Database, Server, HardDrive, Shield } from "lucide-react";
import { toast } from "sonner";
import { getDataSources, updateDataSource, type DataSource } from "@/api/dataSourcesApi";
import { Pill } from "@/components/Badge";
import { KPICard } from "@/components/KPICard";

export const Route = createFileRoute("/data-sources")({
  head: () => ({
    meta: [
      { title: "Data Sources — CoAction" },
      { name: "description", content: "View all data sources and database access across the enterprise." },
    ],
  }),
  component: DataSourcesPage,
});

const columns: { key: keyof DataSource; label: string }[] = [
  { key: "dataSourceName", label: "Data Source" },
  { key: "serverName", label: "Server" },
  { key: "environment", label: "Environment" },
  { key: "databaseType", label: "DB Type" },
  { key: "status", label: "Status" },
  { key: "recoveryModel", label: "Recovery Model" },
  { key: "legacyOrNew", label: "Legacy / New" },
  { key: "accessLevel", label: "Access Level" },
];

function DataSourcesPage() {
  const [data, setData] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [serverFilter, setServerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [envFilter, setEnvFilter] = useState("");
  const [dbTypeFilter, setDbTypeFilter] = useState("");
  const [viewItem, setViewItem] = useState<DataSource | null>(null);
  const [editItem, setEditItem] = useState<DataSource | null>(null);
  const [saving, setSaving] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDataSources();
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

  const servers = useMemo(
    () => Array.from(new Set(data.map((d) => d.serverName).filter(Boolean))).sort(),
    [data],
  );
  const statuses = useMemo(
    () => Array.from(new Set(data.map((d) => d.status).filter(Boolean))).sort(),
    [data],
  );
  const environments = useMemo(
    () => Array.from(new Set(data.map((d) => d.environment).filter(Boolean))).sort(),
    [data],
  );
  const dbTypes = useMemo(
    () => Array.from(new Set(data.map((d) => d.databaseType).filter(Boolean))).sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((row) => {
      if (serverFilter && row.serverName !== serverFilter) return false;
      if (statusFilter && row.status !== statusFilter) return false;
      if (envFilter && row.environment !== envFilter) return false;
      if (dbTypeFilter && row.databaseType !== dbTypeFilter) return false;
      if (q) {
        const hay = `${row.dataSourceName} ${row.serverName} ${row.environment} ${row.databaseType} ${row.status} ${row.recoveryModel} ${row.legacyOrNew} ${row.accessLevel}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, search, serverFilter, statusFilter, envFilter, dbTypeFilter]);

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
      const updated = await updateDataSource(editItem.id, editItem);
      setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setEditItem(null);
      toast.success("Data source updated successfully.");
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
        <span className="ml-3 text-sm text-muted-foreground">Loading data sources…</span>
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

  const onlineCount = data.filter((d) => d.status?.toUpperCase() === "ONLINE").length;
  const offlineCount = data.filter((d) => d.status?.toUpperCase() === "OFFLINE").length;

  return (
    <div className="px-6 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Data Sources</h1>
        <p className="text-sm text-muted-foreground mt-1">Enterprise database and data source inventory — servers, access, and status.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Data Sources" value={data.length} hint="All registered" icon={Database} tone="info" />
        <KPICard label="Online" value={onlineCount} hint={`${data.length ? Math.round((onlineCount / data.length) * 100) : 0}% of total`} icon={HardDrive} tone="success" />
        <KPICard label="Offline" value={offlineCount} hint={`${data.length ? Math.round((offlineCount / data.length) * 100) : 0}% of total`} icon={Shield} tone="warning" />
        <KPICard label="Servers" value={servers.length} hint="Unique servers" icon={Server} tone="default" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-lg p-3 shadow-card">
        <select
          className="h-9 rounded-md border border-input bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          value={serverFilter}
          onChange={(e) => { setServerFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Servers</option>
          {servers.map((s) => (
            <option key={s} value={s}>{s}</option>
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
        <select
          className="h-9 rounded-md border border-input bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          value={envFilter}
          onChange={(e) => { setEnvFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Environments</option>
          {environments.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-input bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          value={dbTypeFilter}
          onChange={(e) => { setDbTypeFilter(e.target.value); setPage(1); }}
        >
          <option value="">All DB Types</option>
          {dbTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search data sources…"
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
                  {columns.map((c) => (
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
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap font-medium text-foreground">
                      {row.dataSourceName}
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap text-muted-foreground">
                      {row.serverName}
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant="info">{row.environment}</Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant="primary">{row.databaseType}</Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant={row.status?.toUpperCase() === "ONLINE" ? "success" : "warning"}>
                        {row.status}
                      </Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      <Pill variant="neutral">{row.recoveryModel}</Pill>
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap text-muted-foreground">
                      {row.legacyOrNew || "—"}
                    </td>
                    <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                      {row.accessLevel ? <Pill variant="info">{row.accessLevel}</Pill> : <span className="text-muted-foreground">—</span>}
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
                    <td colSpan={columns.length + 1} className="px-3 py-12 text-center text-sm text-muted-foreground">
                      No data sources match the current filters.
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
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{viewItem.dataSourceName}</h2>
                <p className="text-xs text-muted-foreground">{viewItem.serverName} — {viewItem.status}</p>
              </div>
              <button type="button" onClick={() => setViewItem(null)} className="h-8 w-8 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="border border-border rounded-lg">
                <div className="px-4 py-2 border-b border-border bg-secondary/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Server & Database</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ViewField label="Data Source Name" value={viewItem.dataSourceName} />
                  <ViewField label="Server Name" value={viewItem.serverName} />
                  <ViewField label="Database Type" value={viewItem.databaseType} />
                  <ViewField label="Environment" value={viewItem.environment} />
                </div>
              </div>
              <div className="border border-border rounded-lg">
                <div className="px-4 py-2 border-b border-border bg-secondary/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status & Access</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ViewField label="Status" value={viewItem.status} />
                  <ViewField label="Recovery Model" value={viewItem.recoveryModel} />
                  <ViewField label="Legacy / New" value={viewItem.legacyOrNew} />
                  <ViewField label="Access Level" value={viewItem.accessLevel} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50" onClick={() => setEditItem(null)}>
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Edit Data Source</h2>
              <button type="button" onClick={() => setEditItem(null)} className="h-8 w-8 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {columns.map((c) => (
                <div key={c.key}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{c.label}</label>
                  <input
                    type="text"
                    value={(editItem[c.key] as string) ?? ""}
                    onChange={(e) => setEditItem({ ...editItem, [c.key]: e.target.value })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
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

function ViewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground mb-0.5">{label}</dt>
      <dd className="text-sm text-foreground whitespace-pre-wrap">{value || "—"}</dd>
    </div>
  );
}
