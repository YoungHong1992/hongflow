export type WorkflowRow = {
  workflowId: string;
  projectId: string;
  nodes: Array<Record<string, unknown>>;
};

export type RunStatusUpdate = {
  status: string;
  provider?: string;
  startedAt?: boolean;
  finishedAt?: boolean;
  error?: string | null;
};
