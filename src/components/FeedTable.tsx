import { Eye, Pencil, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Feed } from "@/api/feedApi";
import { FeedTypePill, Pill, TransferMethodPill, YesNoPill } from "./Badge";

function formatDate(val: string | null | undefined): string {
  if (!val || val === "—" || val === "-") return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const columns: { key: keyof Feed | "actions"; label: string; width?: string }[] = [
  { key: "feedId", label: "Feed ID", width: "w-28" },
  { key: "feedName", label: "Feed Name", width: "w-56" },
  { key: "feedDescription", label: "Description", width: "w-72" },
  { key: "feedType", label: "Feed Type" },
  { key: "businessDomain", label: "Business Domain" },
  { key: "dataOwner", label: "Data Owner" },
  { key: "productOwner", label: "Product Owner" },
  { key: "dataSource", label: "Data Source" },
  { key: "sourceSystem", label: "Source System" },
  { key: "vendorPartner", label: "Vendor / Partner" },
  { key: "transferMethod", label: "Transfer" },
  { key: "fileFormat", label: "Format" },
  { key: "encryption", label: "Encryption" },
  { key: "containsPII", label: "PII" },
  { key: "masking", label: "Masking" },
  { key: "provisionedToGP", label: "Prov. GP" },
  { key: "dateProvisioned", label: "Date Provisioned" },
  { key: "jira", label: "JIRA" },
  { key: "credentials", label: "Credentials" },
  { key: "accessOwners", label: "Access Owner(s)" },
  { key: "accessType", label: "Access Type" },
  { key: "lastChangeDate", label: "Last Change" },
  { key: "version", label: "Version" },
  { key: "environment", label: "Env" },
  { key: "comments", label: "Comments", width: "w-64" },
  { key: "actions", label: "Actions", width: "w-24" },
];

export function FeedTable({ rows }: { rows: Feed[] }) {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [viewFeed, setViewFeed] = useState<Feed | null>(null);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = useMemo(
    () => rows.slice(start, start + pageSize),
    [rows, start, pageSize],
  );

  return (
    <>
    <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="max-h-[620px] overflow-y-auto">
          <table className="min-w-full text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-table-header">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key as string}
                    className={`text-left font-semibold text-xs uppercase tracking-wide text-muted-foreground px-3 py-2.5 border-b border-border whitespace-nowrap ${c.width ?? ""}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr
                  key={row.feedId}
                  className={`${i % 2 === 1 ? "bg-secondary/40" : "bg-card"} hover:bg-accent/60 transition-colors`}
                >
                  <td className="px-3 py-2 border-b border-border font-mono text-xs text-primary whitespace-nowrap">
                    {row.feedId}
                  </td>
                  <td className="px-3 py-2 border-b border-border font-medium text-foreground whitespace-nowrap">
                    {row.feedName}
                  </td>
                  <td className="px-3 py-2 border-b border-border text-muted-foreground">
                    <span className="line-clamp-2">{row.feedDescription}</span>
                  </td>
                  <td className="px-3 py-2 border-b border-border">
                    <FeedTypePill value={row.feedType} />
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    {row.businessDomain}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    {row.dataOwner}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    {row.productOwner}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    <Pill variant={row.dataSource === "CoAction" ? "primary" : "info"}>
                      {row.dataSource}
                    </Pill>
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    {row.sourceSystem}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    {row.vendorPartner}
                  </td>
                  <td className="px-3 py-2 border-b border-border">
                    <TransferMethodPill value={row.transferMethod} />
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    {row.fileFormat}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    {row.encryption}
                  </td>
                  <td className="px-3 py-2 border-b border-border">
                    <YesNoPill value={row.containsPII} />
                  </td>
                  <td className="px-3 py-2 border-b border-border">
                    <YesNoPill value={row.masking} />
                  </td>
                  <td className="px-3 py-2 border-b border-border">
                    <Pill variant={row.provisionedToGP === "Yes" ? "success" : "neutral"}>
                      {row.provisionedToGP}
                    </Pill>
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap tabular-nums text-muted-foreground">
                    {formatDate(row.dateProvisioned)}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    <span className="font-mono text-xs text-info">{row.jira}</span>
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap text-muted-foreground">
                    {row.credentials}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap text-muted-foreground">
                    {row.accessOwners}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap text-muted-foreground">
                    {row.accessType}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap tabular-nums text-muted-foreground">
                    {formatDate(row.lastChangeDate)}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap font-mono text-xs">
                    {row.version}
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    <Pill variant={row.environment === "PROD" ? "success" : row.environment === "UAT" ? "warning" : "info"}>
                      {row.environment}
                    </Pill>
                  </td>
                  <td className="px-3 py-2 border-b border-border text-muted-foreground">
                    <span className="line-clamp-2">{row.comments}</span>
                  </td>
                  <td className="px-3 py-2 border-b border-border whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setViewFeed(row)}
                        className="h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center"
                        aria-label="View"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        to="/feeds/$feedId/edit"
                        params={{ feedId: String(row.id) }}
                        className="h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-12 text-center text-sm text-muted-foreground"
                  >
                    No feeds match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 border-t border-border bg-card">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-7 rounded-md border border-input bg-card px-1.5 text-xs"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>
            {rows.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, rows.length)} of{" "}
            {rows.length}
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

    {/* ── View Feed Modal ─────────────────────────────────────── */}
    {viewFeed && (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50" onClick={() => setViewFeed(null)}>
        <div
          className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{viewFeed.feedName}</h2>
              <p className="text-xs text-muted-foreground font-mono">{viewFeed.feedId}</p>
            </div>
            <button
              type="button"
              onClick={() => setViewFeed(null)}
              className="h-8 w-8 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5 space-y-5">
            <ViewSection title="Feed Details">
              <ViewField label="Feed ID" value={viewFeed.feedId} />
              <ViewField label="Feed Name" value={viewFeed.feedName} />
              <ViewField label="Feed Type" value={viewFeed.feedType} />
              <ViewField label="Business Domain" value={viewFeed.businessDomain} />
              <ViewField label="Feed Description" value={viewFeed.feedDescription} full />
            </ViewSection>
            <ViewSection title="Ownership">
              <ViewField label="Data Owner" value={viewFeed.dataOwner} />
              <ViewField label="Product Owner" value={viewFeed.productOwner} />
            </ViewSection>
            <ViewSection title="Source & Transfer">
              <ViewField label="Data Source" value={viewFeed.dataSource} />
              <ViewField label="Transfer Method" value={viewFeed.transferMethod} />
              <ViewField label="Source System" value={viewFeed.sourceSystem} />
              <ViewField label="Vendor / Partner" value={viewFeed.vendorPartner} />
              <ViewField label="File Format" value={viewFeed.fileFormat} />
              <ViewField label="Encryption" value={viewFeed.encryption} />
            </ViewSection>
            <ViewSection title="Security & Access">
              <ViewField label="Contains PII" value={viewFeed.containsPII} />
              <ViewField label="Masking" value={viewFeed.masking} />
              <ViewField label="Credentials" value={viewFeed.credentials} />
              <ViewField label="Access Type" value={viewFeed.accessType} />
              <ViewField label="Access Owner(s)" value={viewFeed.accessOwners} full />
            </ViewSection>
            <ViewSection title="Provisioning & Tracking">
              <ViewField label="Provisioned to GP" value={viewFeed.provisionedToGP} />
              <ViewField label="Date Provisioned" value={formatDate(viewFeed.dateProvisioned)} />
              <ViewField label="JIRA" value={viewFeed.jira} />
              <ViewField label="Version" value={viewFeed.version} />
              <ViewField label="Environment" value={viewFeed.environment} />
              <ViewField label="Last Change Date" value={formatDate(viewFeed.lastChangeDate)} full />
            </ViewSection>
            <ViewSection title="Comments">
              <ViewField label="Comments" value={viewFeed.comments} full />
            </ViewSection>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function ViewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg">
      <div className="px-4 py-2 border-b border-border bg-secondary/30">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
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
