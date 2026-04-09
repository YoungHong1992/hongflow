import { builtInNodeSpecs } from '@hongflow/nodes';
import { ShellCard, SectionTitle } from '@hongflow/ui';

import { categoryPalette } from '../lib/initial-canvas.js';

export const WorkbenchSidebar = ({
  projectName,
}: {
  projectName: string | undefined;
}) => (
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
          {projectName ?? '尚未创建项目，可通过 API 直接写入。'}
        </p>
      </div>

      {categoryPalette.map((group) => (
        <div key={group.name} className="rounded-2xl border border-white/8 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">{group.name}</p>
          <div className="mt-3 space-y-2">
            {builtInNodeSpecs
              .filter((node) => group.ids.includes(node.category))
              .map((node) => (
                <div key={node.type} className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
                  <p className="text-sm text-white">{node.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#9fb0cd]">{node.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  </ShellCard>
);
