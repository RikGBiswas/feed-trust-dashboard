import { useNavigate, useRouter } from "@tanstack/react-router";
import { Save, RotateCcw, X, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { createFeed, updateFeed, deleteFeed, getFieldOptions, type Feed, type FieldOptions } from "@/api/feedApi";
import { ComboBox } from "@/components/ComboBox";

type FormState = {
  feedId: string;
  feedName: string;
  feedDescription: string;
  feedType: string;
  businessDomain: string;
  dataOwner: string;
  productOwner: string;
  dataSource: string;
  sourceSystem: string;
  vendorPartner: string;
  transferMethod: string;
  fileFormat: string;
  encryption: string;
  containsPII: string;
  masking: string;
  provisionedToGP: string;
  dateProvisioned: string;
  jira: string;
  credentials: string;
  access: string;
  lastChangeDate: string;
  version: string;
  environment: string;
  comments: string;
};

const initial: FormState = {
  feedId: "",
  feedName: "",
  feedDescription: "",
  feedType: "",
  businessDomain: "",
  dataOwner: "",
  productOwner: "",
  dataSource: "",
  sourceSystem: "",
  vendorPartner: "",
  transferMethod: "",
  fileFormat: "",
  encryption: "",
  containsPII: "No",
  masking: "No",
  provisionedToGP: "No",
  dateProvisioned: "",
  jira: "",
  credentials: "",
  access: "",
  lastChangeDate: "",
  version: "",
  environment: "DEV",
  comments: "",
};

const required: (keyof FormState)[] = [
  "feedId",
  "feedName",
  "feedType",
  "businessDomain",
  "dataOwner",
  "dataSource",
  "transferMethod",
];

const inputCls =
  "w-full h-9 px-3 rounded-md border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring";
const textareaCls =
  "w-full px-3 py-2 rounded-md border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring";

/** Convert ISO date string (e.g. 2026-04-20T04:00:00.000Z) to YYYY-MM-DD for date inputs */
function toInputDate(val: string | null | undefined): string {
  if (!val || val === "—" || val === "-") return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toISOString().slice(0, 10);
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-lg shadow-card">
      <header className="px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </header>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required: req,
  error,
  children,
  full,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-xs font-medium text-foreground mb-1.5">
        {label}
        {req && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function FeedForm({ feed }: { feed?: Feed }) {
  const isEdit = !!feed;
  const STORAGE_KEY = "feed-form-draft";

  // Restore draft from sessionStorage for new feeds (not edit)
  const getInitial = (): FormState => {
    if (feed) return initial; // will be overridden by useEffect below
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return initial;
  };

  const [form, setForm] = useState<FormState>(getInitial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [options, setOptions] = useState<FieldOptions>({
    feedType: [], businessDomain: [], dataSource: [], transferMethod: [],
    sourceSystem: [], vendorPartner: [], fileFormat: [], encryption: [],
  });
  const navigate = useNavigate();
  const router = useRouter();

  // Fetch distinct options from DB
  useEffect(() => {
    getFieldOptions().then(setOptions).catch(() => {});
  }, []);

  // Persist form to sessionStorage on every change (only for new feeds)
  useEffect(() => {
    if (!isEdit) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form, isEdit]);

  useEffect(() => {
    if (feed) {
      setForm({
        feedId: feed.feedId ?? "",
        feedName: feed.feedName ?? "",
        feedDescription: feed.feedDescription ?? "",
        feedType: feed.feedType ?? "",
        businessDomain: feed.businessDomain ?? "",
        dataOwner: feed.dataOwner ?? "",
        productOwner: feed.productOwner ?? "",
        dataSource: feed.dataSource ?? "",
        sourceSystem: feed.sourceSystem ?? "",
        vendorPartner: feed.vendorPartner ?? "",
        transferMethod: feed.transferMethod ?? "",
        fileFormat: feed.fileFormat ?? "",
        encryption: feed.encryption ?? "",
        containsPII: feed.containsPII ?? "No",
        masking: feed.masking ?? "No",
        provisionedToGP: feed.provisionedToGP ?? "No",
        dateProvisioned: toInputDate(feed.dateProvisioned),
        jira: feed.jira ?? "",
        credentials: feed.credentials ?? "",
        access: feed.access ?? "",
        lastChangeDate: toInputDate(feed.lastChangeDate),
        version: feed.version ?? "",
        environment: feed.environment ?? "DEV",
        comments: feed.comments ?? "",
      });
    }
  }, [feed]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    required.forEach((k) => {
      if (!String(form[k] ?? "").trim()) e[k] = "This field is required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && feed) {
        await updateFeed(feed.id, form);
        toast.success(`Feed "${form.feedName}" updated successfully.`);
      } else {
        await createFeed(form as any);
        toast.success(`Feed "${form.feedName}" saved successfully.`);
      }
      await router.invalidate();
      sessionStorage.removeItem(STORAGE_KEY);
      navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save feed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setForm(initial);
    setErrors({});
    sessionStorage.removeItem(STORAGE_KEY);
    toast("Form reset");
  };

  const onDelete = async () => {
    if (!feed) return;
    setDeleting(true);
    try {
      await deleteFeed(feed.id);
      toast.success(`Feed "${feed.feedName}" deleted successfully.`);
      navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete feed";
      toast.error(msg);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Section title="Feed Details" description="Identifying information for this data feed.">
        <Field label="Feed ID" required error={errors.feedId}>
          <input
            className={inputCls}
            value={form.feedId}
            onChange={(e) => set("feedId", e.target.value)}
            placeholder="FD-1013"
          />
        </Field>
        <Field label="Feed Name" required error={errors.feedName}>
          <input
            className={inputCls}
            value={form.feedName}
            onChange={(e) => set("feedName", e.target.value)}
            placeholder="Policy Master Daily"
          />
        </Field>
        <Field label="Feed Type" required error={errors.feedType}>
          <ComboBox
            value={form.feedType}
            onChange={(v) => set("feedType", v)}
            options={options.feedType}
            placeholder="Internal / External"
          />
        </Field>
        <Field label="Business Domain" required error={errors.businessDomain}>
          <ComboBox
            value={form.businessDomain}
            onChange={(v) => set("businessDomain", v)}
            options={options.businessDomain}
            placeholder="Claims / Policy / Premium"
          />
        </Field>
        <Field label="Feed Description" full>
          <textarea
            className={textareaCls}
            rows={3}
            value={form.feedDescription}
            onChange={(e) => set("feedDescription", e.target.value)}
            placeholder="Brief description of what this feed contains and how it is used."
          />
        </Field>
      </Section>

      <Section title="Ownership" description="Who owns and is responsible for this feed.">
        <Field label="Data Owner" required error={errors.dataOwner}>
          <input
            className={inputCls}
            value={form.dataOwner}
            onChange={(e) => set("dataOwner", e.target.value)}
          />
        </Field>
        <Field label="Product Owner">
          <input
            className={inputCls}
            value={form.productOwner}
            onChange={(e) => set("productOwner", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Source & Transfer" description="Where the data comes from and how it moves.">
        <Field label="Data Source" required error={errors.dataSource}>
          <ComboBox
            value={form.dataSource}
            onChange={(v) => set("dataSource", v)}
            options={options.dataSource}
            placeholder="Coaction / Sapiens / Brinqa"
          />
        </Field>
        <Field label="Transfer Method" required error={errors.transferMethod}>
          <ComboBox
            value={form.transferMethod}
            onChange={(v) => set("transferMethod", v)}
            options={options.transferMethod}
            placeholder="File Share / Application / Email"
          />
        </Field>
        <Field label="Source System">
          <ComboBox
            value={form.sourceSystem}
            onChange={(v) => set("sourceSystem", v)}
            options={options.sourceSystem}
            placeholder="CoreODS / Sapiens"
          />
        </Field>
        <Field label="Vendor / Partner">
          <ComboBox
            value={form.vendorPartner}
            onChange={(v) => set("vendorPartner", v)}
            options={options.vendorPartner}
            placeholder="Coaction / Sapiens / Workday"
          />
        </Field>
        <Field label="File Format">
          <ComboBox
            value={form.fileFormat}
            onChange={(v) => set("fileFormat", v)}
            options={options.fileFormat}
            placeholder="CSV / JSON / XLSX"
          />
        </Field>
        <Field label="Encryption">
          <ComboBox
            value={form.encryption}
            onChange={(v) => set("encryption", v)}
            options={options.encryption}
            placeholder="No / PGP / TLS"
          />
        </Field>
      </Section>

      <Section title="Security & Access" description="PII handling, masking, and access controls.">
        <Field label="Contains PII">
          <select
            className={inputCls}
            value={form.containsPII}
            onChange={(e) => set("containsPII", e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </Field>
        <Field label="Masking">
          <select
            className={inputCls}
            value={form.masking}
            onChange={(e) => set("masking", e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </Field>
        <Field label="Credentials">
          <input
            className={inputCls}
            value={form.credentials}
            onChange={(e) => set("credentials", e.target.value)}
            placeholder="Vault path or credential reference"
          />
        </Field>
        <Field label="Access">
          <input
            className={inputCls}
            value={form.access}
            onChange={(e) => set("access", e.target.value)}
            placeholder="Service Account / OAuth2 / SFTP Key"
          />
        </Field>
      </Section>

      <Section title="Provisioning & Tracking" description="Delivery to GP, JIRA, and version history.">
        <Field label="Data Provisioned to GP">
          <select
            className={inputCls}
            value={form.provisionedToGP}
            onChange={(e) => set("provisionedToGP", e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </Field>
        <Field label="Date Provisioned">
          <input
            type="date"
            className={inputCls}
            value={form.dateProvisioned}
            onChange={(e) => set("dateProvisioned", e.target.value)}
          />
        </Field>
        <Field label="JIRA">
          <input
            className={inputCls}
            value={form.jira}
            onChange={(e) => set("jira", e.target.value)}
            placeholder="DATA-XXXX"
          />
        </Field>
        <Field label="Version">
          <input
            className={inputCls}
            value={form.version}
            onChange={(e) => set("version", e.target.value)}
            placeholder="1.0.0"
          />
        </Field>
        <Field label="Environment">
          <select
            className={inputCls}
            value={form.environment}
            onChange={(e) => set("environment", e.target.value)}
          >
            <option>DEV</option>
            <option>UAT</option>
            <option>PROD</option>
          </select>
        </Field>
        <Field label="Last Change Date" full>
          <input
            type="date"
            className={inputCls}
            value={form.lastChangeDate}
            onChange={(e) => set("lastChangeDate", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Comments">
        <Field label="Comments" full>
          <textarea
            className={textareaCls}
            rows={4}
            value={form.comments}
            onChange={(e) => set("comments", e.target.value)}
            placeholder="Additional notes, change rationale, or context."
          />
        </Field>
      </Section>

      <div className="sticky bottom-0 bg-card/95 backdrop-blur border border-border rounded-lg shadow-card p-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          {isEdit && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-9 px-3 rounded-md bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 flex items-center gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete Feed
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="h-9 px-3 rounded-md border border-input bg-card text-sm hover:bg-accent flex items-center gap-1.5"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={onReset}
            className="h-9 px-3 rounded-md border border-input bg-card text-sm hover:bg-accent flex items-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-95 disabled:opacity-60 flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {submitting ? "Saving…" : isEdit ? "Update Feed" : "Save Feed"}
          </button>
        </div>
      </div>

      {/* ── Delete Confirmation Dialog ────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Delete Feed</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-foreground">"{feed?.feedName}"</span>?
              All data associated with this feed will be removed.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="h-9 px-4 rounded-md border border-input bg-card text-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="h-9 px-4 rounded-md bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 disabled:opacity-60 flex items-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting…" : "Delete Feed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
