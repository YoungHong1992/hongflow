import type { assetTypes, nodeCategories, runStatuses } from './constants.js';

export type AssetType = (typeof assetTypes)[number];
export type RunStatus = (typeof runStatuses)[number];
export type NodeCategory = (typeof nodeCategories)[number];

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  projectId: string;
  name: string;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  projectId: string;
  type: AssetType;
  storagePath: string;
  metadata: Record<string, unknown>;
  thumbnailPath: string | null;
  createdAt: string;
}

export interface WorkflowDocument {
  id: string;
  boardId: string;
  schemaVersion: string;
  nodes: Array<Record<string, unknown>>;
  edges: Array<Record<string, unknown>>;
  variables: Record<string, unknown>;
}

export interface RunLogEntry {
  at: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface Run {
  id: string;
  workflowId: string;
  status: RunStatus;
  provider: string;
  startedAt: string | null;
  finishedAt: string | null;
  logs: RunLogEntry[];
  error: string | null;
  createdAt: string;
}

export interface Variant {
  id: string;
  runId: string;
  assetId: string;
  score: number | null;
  isFavorite: boolean;
  createdAt: string;
}

export interface ProviderConfig {
  id: string;
  provider: string;
  encryptedKey: string;
  endpoint: string | null;
  modelDefaults: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateImageInput {
  prompt: string;
  negativePrompt?: string;
  style?: string;
  count?: number;
  width?: number;
  height?: number;
  references?: string[];
}

export interface GenerateResult {
  images: Array<{
    url?: string;
    localPath?: string;
    width?: number;
    height?: number;
    metadata?: Record<string, unknown>;
  }>;
  raw?: unknown;
}
