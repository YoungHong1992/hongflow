import type { EditableNode } from '../../../components/NodeInspector.js';
import type { CanvasNode } from '../types/canvas.js';

export const getSelectedEditableNode = (
  nodes: CanvasNode[],
  selectedNodeId: string | null,
): EditableNode | null => {
  const activeNode = nodes.find((node) => node.id === selectedNodeId);

  if (!activeNode) {
    return null;
  }

  return {
    id: activeNode.id,
    type: activeNode.id === 'prompt' ? 'Text.Prompt' : 'Generic',
    data: activeNode.data as Record<string, unknown>,
  };
};
