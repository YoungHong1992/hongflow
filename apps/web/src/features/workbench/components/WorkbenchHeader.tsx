import { builtInNodeSpecs } from '@hongflow/nodes';
import { ShellCard, SectionTitle } from '@hongflow/ui';

import type { HealthResponse, NodeCatalogResponse, ProjectListResponse } from '../../../lib/api.js';

export const WorkbenchHeader = ({
  health,
  projects,
  nodeCatalog,
}: {
  health: HealthResponse | undefined;
  projects: ProjectListResponse | undefined;
  nodeCatalog: NodeCatalogResponse | undefined;
}) => (
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
        <p className="mt-2 text-2xl font-semibold text-white">{health?.ok ? 'Ready' : 'Bootstrapping'}</p>
        <p className="mt-2 text-sm text-[#a8b4cc]">API、数据库和队列健康状态在这里收敛展示。</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#9eb2d4]">Projects</p>
        <p className="mt-2 text-2xl font-semibold text-white">{projects?.projects.length ?? 0}</p>
        <p className="mt-2 text-sm text-[#a8b4cc]">项目表与 workflow 持久化已经完成初始化。</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#9eb2d4]">Nodes</p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {nodeCatalog?.nodes.length ?? builtInNodeSpecs.length}
        </p>
        <p className="mt-2 text-sm text-[#a8b4cc]">内置节点目录按素材、编排、结果三层组织。</p>
      </div>
    </ShellCard>
  </header>
);
