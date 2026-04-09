import { useMemo } from 'react';
import { addEdge, useEdgesState, useNodesState } from '@xyflow/react';

import { useCanvasStore } from '../../../lib/store.js';
import type { EditableNode } from '../../../components/NodeInspector.js';
import { initialEdges, initialNodes } from '../lib/initial-canvas.js';
import { getSelectedEditableNode } from '../lib/selection.js';

export const useWorkbenchCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const selectedNodeId = useCanvasStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useCanvasStore((state) => state.setSelectedNodeId);

  const selectedNode = useMemo(
    () => getSelectedEditableNode(nodes, selectedNodeId),
    [nodes, selectedNodeId],
  );

  const patchNode = (nodeId: string, data: Record<string, unknown>) => {
    setNodes((current) =>
      current.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)),
    );
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect: (connection: Parameters<typeof addEdge>[0]) =>
      setEdges((current) => addEdge(connection, current)),
    onNodeClick: (nodeId: string) => setSelectedNodeId(nodeId),
    selectedNode: selectedNode as EditableNode | null,
    patchNode,
  };
};
