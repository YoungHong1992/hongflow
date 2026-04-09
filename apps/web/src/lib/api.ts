import type { Project } from '@hongflow/shared';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
};

export interface HealthResponse {
  ok: boolean;
  app: string;
  database: 'up' | 'down';
  queue: 'up' | 'down';
  now: string;
}

export interface NodeCatalogResponse {
  nodes: Array<{
    type: string;
    title: string;
    description: string;
    category: string;
  }>;
}

export interface ProjectListResponse {
  projects: Project[];
}

export const api = {
  getHealth: () => fetchJson<HealthResponse>('/health'),
  getNodeCatalog: () => fetchJson<NodeCatalogResponse>('/node-catalog'),
  getProjects: () => fetchJson<ProjectListResponse>('/projects'),
};
