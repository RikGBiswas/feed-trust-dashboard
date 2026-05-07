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

export type Feed = {
  id: number;
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
  lastChangeDate: string;
  version: string;
  environment: string;
  comments: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FeedKpis = {
  totalFeeds: number;
  thirdPartyFeeds: number;
  coactionInternalFeeds: number;
  feedsWithPii: number;
  maskedFeeds: number;
  feedsProvisionedToGp: number;
  feedsWithJira: number;
  sftpFeeds: number;
};

export function getFeeds(): Promise<Feed[]> {
  return request<Feed[]>("/api/feeds");
}

export function getFeedById(id: number | string): Promise<Feed> {
  return request<Feed>(`/api/feeds/${id}`);
}

export function createFeed(feedData: Omit<Feed, "id" | "createdAt" | "updatedAt">): Promise<Feed> {
  return request<Feed>("/api/feeds", {
    method: "POST",
    body: JSON.stringify(feedData),
  });
}

export function updateFeed(id: number | string, feedData: Partial<Feed>): Promise<Feed> {
  return request<Feed>(`/api/feeds/${id}`, {
    method: "PUT",
    body: JSON.stringify(feedData),
  });
}

export function deleteFeed(id: number | string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/feeds/${id}`, {
    method: "DELETE",
  });
}

export function getFeedKpis(): Promise<FeedKpis> {
  return request<FeedKpis>("/api/feeds/kpis/summary");
}

export type FieldOptions = {
  feedType: string[];
  businessDomain: string[];
  dataSource: string[];
  transferMethod: string[];
  sourceSystem: string[];
  vendorPartner: string[];
  fileFormat: string[];
  encryption: string[];
};

export function getFieldOptions(): Promise<FieldOptions> {
  return request<FieldOptions>("/api/feeds/options/distinct");
}
