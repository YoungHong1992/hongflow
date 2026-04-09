import { NodeInspector } from '../../../components/NodeInspector.js';
import { WorkbenchCanvas } from './WorkbenchCanvas.js';
import { WorkbenchFooter } from './WorkbenchFooter.js';
import { WorkbenchHeader } from './WorkbenchHeader.js';
import { WorkbenchSidebar } from './WorkbenchSidebar.js';
import { useWorkbenchCanvas } from '../hooks/useWorkbenchCanvas.js';
import { useWorkbenchQueries } from '../hooks/useWorkbenchQueries.js';

export const WorkbenchPage = () => {
  const { healthQuery, projectsQuery, nodeCatalogQuery } = useWorkbenchQueries();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick, selectedNode, patchNode } =
    useWorkbenchCanvas();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(243,180,87,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(61,142,214,0.18),_transparent_35%),linear-gradient(180deg,_#05070d,_#0b1020_36%,_#09111f)] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col gap-4 px-4 py-4 lg:px-6">
        <WorkbenchHeader
          health={healthQuery.data}
          projects={projectsQuery.data}
          nodeCatalog={nodeCatalogQuery.data}
        />

        <main className="grid flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
          <WorkbenchSidebar projectName={projectsQuery.data?.projects[0]?.name} />

          <WorkbenchCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
          />

          <NodeInspector node={selectedNode} onPatch={patchNode} />
        </main>

        <WorkbenchFooter
          health={healthQuery.data}
          nodeCatalog={nodeCatalogQuery.data}
          nodeCatalogReady={nodeCatalogQuery.isSuccess}
        />
      </div>
    </div>
  );
};
