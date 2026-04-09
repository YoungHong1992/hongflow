export const WORKFLOW_SCHEMA_VERSION = '0.1.0';
export const RUN_QUEUE_NAME = 'hongflow-runs';

export const assetTypes = [
  'product',
  'packaging',
  'reference',
  'brand',
  'output',
] as const;

export const runStatuses = [
  'queued',
  'running',
  'completed',
  'failed',
] as const;

export const nodeCategories = [
  'asset',
  'text',
  'generator',
  'control',
  'result',
  'export',
] as const;
