export type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BoardRow = {
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
};

export type RunRow = {
  id: string;
  workflowId: string;
  status: string;
  provider: string;
  startedAt: string | null;
  finishedAt: string | null;
  logs: Array<{ at: string; level: string; message: string }>;
  error: string | null;
  createdAt: string;
};
