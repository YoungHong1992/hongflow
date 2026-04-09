import { z } from 'zod';

import {
  assetTypes,
  nodeCategories,
  runStatuses,
  WORKFLOW_SCHEMA_VERSION,
} from './constants.js';

export const viewportSchema = z.object({
  x: z.number().default(0),
  y: z.number().default(0),
  zoom: z.number().default(1),
});

export const assetTypeSchema = z.enum(assetTypes);
export const runStatusSchema = z.enum(runStatuses);
export const nodeCategorySchema = z.enum(nodeCategories);

export const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
});

export const createBoardSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(120),
});

export const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.string(), z.unknown()),
});

export const workflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

export const workflowDocumentSchema = z.object({
  schemaVersion: z.string().default(WORKFLOW_SCHEMA_VERSION),
  nodes: z.array(workflowNodeSchema).default([]),
  edges: z.array(workflowEdgeSchema).default([]),
  variables: z.record(z.string(), z.unknown()).default({}),
  viewport: viewportSchema.default({
    x: 0,
    y: 0,
    zoom: 1,
  }),
});

export const createRunSchema = z.object({
  workflowId: z.string().uuid(),
  provider: z.string().default('mock'),
});

export const providerConfigSchema = z.object({
  provider: z.string().min(1),
  apiKey: z.string().min(1),
  endpoint: z.string().url().optional(),
  modelDefaults: z.record(z.string(), z.unknown()).default({}),
});

export const listAssetSchema = z.object({
  projectId: z.string().uuid(),
});
