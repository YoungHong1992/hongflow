import { useMemo } from 'react';
import {
  Background,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useQuery } from '@tanstack/react-query';

import { builtInNodeSpecs } from '@hongflow/nodes';
import { ShellCard, SectionTitle, StatusBadge } from '@hongflow/ui';

import { NodeInspector } from './components/NodeInspector.js';
import { api } from './lib/api.js';
import { useCanvasStore } from './lib/store.js';

const initialNodes: Array<Node<Record<string, unknown>>> = [
  {
    id: 'product',
    type: 'default',
    position: { x: 80, y: 80 },
    data: { label: '商品图', subtitle: 'Product hero source' },
  },
  {
    id: 'prompt',
    type: 'default',
    position: { x: 360, y: 120 },
    data: {
      label: 'Prompt',
      prompt: 'premium bottle hero shot, clean reflection, studio lighting, brand-forward layout',
      style: 'e-commerce hero',
    },
  },
  {
    id: 'preset',
    type: 'default',
    position: { x: 360, y: 300 },
    data: { label: '参数模板', width: 1024, height: 1024, quality: 'high' },
  },
  {
    id: 'generate',
    type: 'default',
    position: { x: 690, y: 190 },
    data: { label: '图像生成', provider: 'mock', variants: 4 },
  },
  {
    id: 'gallery',
    type: 'default',
    position: { x: 1020, y: 190 },
    data: { label: '结果画廊', columns: 2 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-product-generate', source: 'product', target: 'generate' },
  { id: 'e-prompt-generate', source: 'prompt', target: 'generate' },
  { id: 'e-preset-generate', source: 'preset', target: 'generate' },
  { id: 'e-generate-gallery', source: 'generate', target: 'gallery' },
];

const categoryPalette = [
  { name: '素材层', ids: ['asset'] },
  { name: '编排层', ids: ['text', 'control', 'generator'] },
  { name: '结果层', ids: ['result', 'export'] },
];

const AppShell = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const selectedNodeId = useCanvasStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useCanvasStore((state) => state.setSelectedNodeId);

  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    refetchInterval: 15_000,
  });

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });

  const nodeCatalogQuery = useQuery({
    queryKey: ['node-catalog'],
    queryFn: api.getNodeCatalog,
  });

  const selectedNode = useMemo(() => {
    const activeNode = nodes.find((node) => node.id === selectedNodeId);

    if (!activeNode) {
      return null;
    }

    return {
      id: activeNode.id,
      type: activeNode.id === 'prompt' ? 'Text.Prompt' : 'Generic',
      data: activeNode.data as Record<string, unknown>,
    };
  }, [nodes, selectedNodeId]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(243,180,87,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(61,142,214,0.18),_transparent_35%),linear-gradient(180deg,_#05070d,_#0b1020_36%,_#09111f)] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col gap-4 px-4 py-4 lg:px-6">
        <header className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <ShellCard>
            <SectionTitle
              eyebrow="HongFlow Community"
              title="商品视觉生产工作台"
              description="第一期初始化版本优先固定画布、节点协议、运行系统和自部署结构，让社区先能跑起来。"
            />
          </ShellCard>
          <ShellCard className="grid gap-4 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#9eb2d4]">System</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {healthQuery.data?.ok ? 'Ready' : 'Bootstrapping'}
              </p>
              <p className="mt-2 text-sm text-[#a8b4cc]">
                API、数据库和队列健康状态在这里收敛展示。
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#9eb2d4]">Projects</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {projectsQuery.data?.projects.length ?? 0}
              </p>
              <p className="mt-2 text-sm text-[#a8b4cc]">项目表与 workflow 持久化已经完成初始化。</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#9eb2d4]">Nodes</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {nodeCatalogQuery.data?.nodes.length ?? builtInNodeSpecs.length}
              </p>
              <p className="mt-2 text-sm text-[#a8b4cc]">
                内置节点目录按素材、编排、结果三层组织。
              </p>
            </div>
          </ShellCard>
        </header>

        <main className="grid flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
          <ShellCard className="flex h-full flex-col gap-4">
            <SectionTitle
              eyebrow="Left Rail"
              title="项目与节点目录"
              description="左侧保留项目、素材、节点入口，避免把画布变成只有技术人员才看得懂的流程图。"
            />
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">本地项目</p>
                <p className="mt-1 text-sm text-[#a8b4cc]">
                  {projectsQuery.data?.projects[0]?.name ?? '尚未创建项目，可通过 API 直接写入。'}
                </p>
              </div>

              {categoryPalette.map((group) => (
                <div key={group.name} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">{group.name}</p>
                  <div className="mt-3 space-y-2">
                    {builtInNodeSpecs
                      .filter((node) => group.ids.includes(node.category))
                      .map((node) => (
                        <div
                          key={node.type}
                          className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3"
                        >
                          <p className="text-sm text-white">{node.title}</p>
                          <p className="mt-1 text-xs leading-5 text-[#9fb0cd]">{node.description}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </ShellCard>

          <ShellCard className="relative overflow-hidden p-0">
            <ReactFlow
              className="rounded-3xl"
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={(connection) => setEdges((current) => addEdge(connection, current))}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
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

          <NodeInspector
            node={selectedNode}
            onPatch={(nodeId, data) => {
              setNodes((current) =>
                current.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)),
              );
            }}
          />
        </main>

        <footer className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <ShellCard className="flex flex-wrap items-center gap-3">
            <StatusBadge
              tone={healthQuery.data?.database === 'up' ? 'success' : 'warning'}
              label={`DB ${healthQuery.data?.database ?? 'checking'}`}
            />
            <StatusBadge
              tone={healthQuery.data?.queue === 'up' ? 'success' : 'warning'}
              label={`Queue ${healthQuery.data?.queue ?? 'checking'}`}
            />
            <StatusBadge
              tone={nodeCatalogQuery.isSuccess ? 'success' : 'neutral'}
              label={`${nodeCatalogQuery.data?.nodes.length ?? builtInNodeSpecs.length} node specs`}
            />
          </ShellCard>
          <ShellCard className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#a8b4cc]">当前状态栏预留给 run 日志、重试和导出队列。</p>
            <span className="font-['IBM_Plex_Mono'] text-xs text-[#d9e2f4]">
              schema v0.1.0
            </span>
          </ShellCard>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <AppShell />
    </ReactFlowProvider>
  );
}
