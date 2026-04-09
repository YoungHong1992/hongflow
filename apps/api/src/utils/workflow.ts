import { WORKFLOW_SCHEMA_VERSION } from '@hongflow/shared';

import { toJson } from '../serializers/json.js';

export const defaultViewport = {
  x: 0,
  y: 0,
  zoom: 1,
};

export const defaultWorkflowDocument = {
  schemaVersion: WORKFLOW_SCHEMA_VERSION,
  nodes: [] as Array<Record<string, unknown>>,
  edges: [] as Array<Record<string, unknown>>,
  variables: {},
};

export const serializeDefaultWorkflow = () => ({
  schemaVersion: defaultWorkflowDocument.schemaVersion,
  nodes: toJson(defaultWorkflowDocument.nodes),
  edges: toJson(defaultWorkflowDocument.edges),
  variables: toJson(defaultWorkflowDocument.variables),
});
