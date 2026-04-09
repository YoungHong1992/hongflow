import { builtInNodeSpecs } from '@hongflow/nodes';
import { ShellCard, StatusBadge } from '@hongflow/ui';

import type { HealthResponse, NodeCatalogResponse } from '../../../lib/api.js';

export const WorkbenchFooter = ({
  health,
  nodeCatalog,
  nodeCatalogReady,
}: {
  health: HealthResponse | undefined;
  nodeCatalog: NodeCatalogResponse | undefined;
  nodeCatalogReady: boolean;
}) => (
  <footer className="grid gap-4 lg:grid-cols-[1fr_auto]">
    <ShellCard className="flex flex-wrap items-center gap-3">
      <StatusBadge
        tone={health?.database === 'up' ? 'success' : 'warning'}
        label={`DB ${health?.database ?? 'checking'}`}
      />
      <StatusBadge
        tone={health?.queue === 'up' ? 'success' : 'warning'}
        label={`Queue ${health?.queue ?? 'checking'}`}
      />
      <StatusBadge
        tone={nodeCatalogReady ? 'success' : 'neutral'}
        label={`${nodeCatalog?.nodes.length ?? builtInNodeSpecs.length} node specs`}
      />
    </ShellCard>
    <ShellCard className="flex items-center justify-between gap-3">
      <p className="text-sm text-[#a8b4cc]">当前状态栏预留给 run 日志、重试和导出队列。</p>
      <span className="font-['IBM_Plex_Mono'] text-xs text-[#d9e2f4]">schema v0.1.0</span>
    </ShellCard>
  </footer>
);
