import { useNavigate } from "@tanstack/react-router";
import { Save, RotateCcw, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

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
  accessOwners: string;
  accessType: string;
  lastChangeDate: string;
  version: string;
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
  accessOwners: "",
  accessType: "",
  lastChangeDate: "",
  version: "",
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

export function FeedForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Feed "${form.feedName}" saved successfully.`);
      navigate({ to: "/" });
    }, 500);
  };

  const onReset = () => {
    setForm(initial);
    setErrors({});
    toast("Form reset");
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
          <input
            className={inputCls}
            value={form.feedType}
            onChange={(e) => set("feedType", e.target.value)}
            placeholder="Batch / Streaming / API"
          />
        </Field>
        <Field label="Business Domain" required error={errors.businessDomain}>
          <input
            className={inputCls}
            value={form.businessDomain}
            onChange={(e) => set("businessDomain", e.target.value)}
            placeholder="Underwriting"
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
          <select
            className={inputCls}
            value={form.dataSource}
            onChange={(e) => set("dataSource", e.target.value)}
          >
            <option value="">Select…</option>
            <option>CoAction</option>
            <option>Third Party</option>
          </select>
        </Field>
        <Field label="Transfer Method" required error={errors.transferMethod}>
          <select
            className={inputCls}
            value={form.transferMethod}
            onChange={(e) => set("transferMethod", e.target.value)}
          >
            <option value="">Select…</option>
            <option>SFTP</option>
            <option>API</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Source System">
          <input
            className={inputCls}
            value={form.sourceSystem}
            onChange={(e) => set("sourceSystem", e.target.value)}
          />
        </Field>
        <Field label="Vendor / Partner">
          <input
            className={inputCls}
            value={form.vendorPartner}
            onChange={(e) => set("vendorPartner", e.target.value)}
          />
        </Field>
        <Field label="File Format">
          <input
            className={inputCls}
            value={form.fileFormat}
            onChange={(e) => set("fileFormat", e.target.value)}
            placeholder="CSV / JSON / XLSX"
          />
        </Field>
        <Field label="Encryption">
          <input
            className={inputCls}
            value={form.encryption}
            onChange={(e) => set("encryption", e.target.value)}
            placeholder="PGP / TLS"
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
        <Field label="Access Type">
          <input
            className={inputCls}
            value={form.accessType}
            onChange={(e) => set("accessType", e.target.value)}
            placeholder="Service Account / OAuth2 / SFTP Key"
          />
        </Field>
        <Field label="Access Owner(s)" full>
          <input
            className={inputCls}
            value={form.accessOwners}
            onChange={(e) => set("accessOwners", e.target.value)}
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

      <div className="sticky bottom-0 bg-card/95 backdrop-blur border border-border rounded-lg shadow-card p-3 flex flex-wrap items-center justify-end gap-2">
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
          {submitting ? "Saving…" : "Save Feed"}
        </button>
      </div>
    </form>
  );
}
