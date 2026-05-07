const BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// ── Data Integrations ────────────────────────────────────────────────
export type DataIntegration = {
  id: number;
  domain: string;
  sourceSystem: string;
  sourcePlatform: string;
  integrationInterface: string;
  targetSystem: string;
  targetLayer: string;
  targetPlatform: string;
  feedType: string;
  frequency: string;
  createdAt?: string;
  updatedAt?: string;
};

export function getDataIntegrations(): Promise<DataIntegration[]> {
  return request<DataIntegration[]>("/api/integrations");
}

export function createDataIntegration(data: Omit<DataIntegration, "id" | "createdAt" | "updatedAt">): Promise<DataIntegration> {
  return request<DataIntegration>("/api/integrations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateDataIntegration(id: number, data: Partial<DataIntegration>): Promise<DataIntegration> {
  return request<DataIntegration>(`/api/integrations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteDataIntegration(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/integrations/${id}`, { method: "DELETE" });
}

// ── API Library ──────────────────────────────────────────────────────
export type ApiEntry = {
  id: number;
  rowNum: number;
  exportable: string;
  rowType: string;
  match: string;
  name: string;
  description: string;
  sourceOwner: string;
  sourceType: string;
  dataSource: string;
  integrationType: string;
  targetOwner: string;
  targetType: string;
  target: string;
  status: string;
  domain: string;
  pointOfContact: string;
  origin: string;
  questions: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

export function getApiEntries(): Promise<ApiEntry[]> {
  return request<ApiEntry[]>("/api/api-library");
}

export function createApiEntry(data: Omit<ApiEntry, "id" | "createdAt" | "updatedAt">): Promise<ApiEntry> {
  return request<ApiEntry>("/api/api-library", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateApiEntry(id: number, data: Partial<ApiEntry>): Promise<ApiEntry> {
  return request<ApiEntry>(`/api/api-library/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteApiEntry(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/api-library/${id}`, { method: "DELETE" });
}
