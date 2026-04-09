import { ReactFlowProvider } from '@xyflow/react';

import { WorkbenchPage } from './features/workbench/components/WorkbenchPage.js';

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkbenchPage />
    </ReactFlowProvider>
  );
}
