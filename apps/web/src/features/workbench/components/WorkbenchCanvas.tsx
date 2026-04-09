import {
  Background,
  Controls,
  type Connection,
  type EdgeChange,
  MiniMap,
  type NodeChange,
  Panel,
  ReactFlow,
} from '@xyflow/react';

import { ShellCard } from '@hongflow/ui';

export const WorkbenchCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
}: {
  nodes: Array<import('../types/canvas.js').CanvasNode>;
  edges: Array<import('../types/canvas.js').CanvasEdge>;
  onNodesChange: (changes: NodeChange<import('../types/canvas.js').CanvasNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<import('../types/canvas.js').CanvasEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (nodeId: string) => void;
}) => {
  return (
    <ShellCard className="relative overflow-hidden p-0">
      <ReactFlow
        className="rounded-3xl"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick(node.id)}
        fitView
      >
        <Panel position="top-left">
          <div className="rounded-2xl border border-white/8 bg-black/35 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9eb2d4]">Canvas</p>
            <p className="mt-1 text-sm text-white">商品主图生成模板</p>
          </div>
        </Panel>
        <MiniMap
          pannable
          zoomable
          style={{
            background: 'rgba(6, 10, 18, 0.72)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
          }}
        />
        <Controls />
        <Background gap={24} size={1} color="rgba(158, 178, 212, 0.16)" />
      </ReactFlow>
    </ShellCard>
  );
};
