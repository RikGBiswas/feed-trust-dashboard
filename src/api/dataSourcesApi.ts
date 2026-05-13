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

export type DataSource = {
  id: number;
  dataSourceName: string;
  serverName: string;
  environment: string;
  databaseType: string;
  status: string;
  recoveryModel: string;
  legacyOrNew: string;
  accessLevel: string;
  containsPII: string;
  dataMasking: string;
  provisionedToGP: string;
  dateProvisioned: string;
  jira: string;
  createdAt?: string;
  updatedAt?: string;
};

export function getDataSources(): Promise<DataSource[]> {
  return request<DataSource[]>("/api/data-sources");
}

export function getDataSourceById(id: number): Promise<DataSource> {
  return request<DataSource>(`/api/data-sources/${id}`);
}

export function createDataSource(data: Omit<DataSource, "id" | "createdAt" | "updatedAt">): Promise<DataSource> {
  return request<DataSource>("/api/data-sources", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateDataSource(id: number, data: Partial<DataSource>): Promise<DataSource> {
  return request<DataSource>(`/api/data-sources/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteDataSource(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/data-sources/${id}`, { method: "DELETE" });
}
