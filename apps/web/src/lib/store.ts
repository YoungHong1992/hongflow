import { create } from 'zustand';

interface CanvasStore {
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  selectedNodeId: null,
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
}));
