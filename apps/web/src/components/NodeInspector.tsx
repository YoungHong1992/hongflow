import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ShellCard, SectionTitle } from '@hongflow/ui';

const promptFormSchema = z.object({
  label: z.string().min(1),
  prompt: z.string().min(1),
  style: z.string().optional(),
});

type PromptForm = z.infer<typeof promptFormSchema>;

export interface EditableNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export const NodeInspector = ({
  node,
  onPatch,
}: {
  node: EditableNode | null;
  onPatch: (nodeId: string, data: Record<string, unknown>) => void;
}) => {
  const form = useForm<PromptForm>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      label: 'Prompt',
      prompt: '',
      style: '',
    },
  });

  useEffect(() => {
    if (!node || node.type !== 'Text.Prompt') {
      return;
    }

    form.reset({
      label: String(node.data.label ?? 'Prompt'),
      prompt: String(node.data.prompt ?? ''),
      style: String(node.data.style ?? ''),
    });
  }, [form, node]);

  if (!node) {
    return (
      <ShellCard className="h-full">
        <SectionTitle
          eyebrow="Inspector"
          title="选择一个节点"
          description="当前画布已经预置商品视觉 workflow，你可以先点选 Prompt 或参数节点查看属性。"
        />
      </ShellCard>
    );
  }

  if (node.type !== 'Text.Prompt') {
    return (
      <ShellCard className="h-full">
        <SectionTitle
          eyebrow="Inspector"
          title={node.type}
          description="当前初始化阶段先开放 Prompt 节点的表单编辑，其余节点展示元数据与默认配置。"
        />
        <pre className="mt-4 overflow-auto rounded-2xl bg-black/30 p-4 font-['IBM_Plex_Mono'] text-xs text-[#c8d2e6]">
          {JSON.stringify(node.data, null, 2)}
        </pre>
      </ShellCard>
    );
  }

  return (
    <ShellCard className="h-full">
      <SectionTitle
        eyebrow="Inspector"
        title="Prompt 节点"
        description="用最少表单控制最核心的商品视觉输入，避免把右侧面板做成工程参数墙。"
      />
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit((values) => {
          onPatch(node.id, values);
        })}
      >
        <label className="block space-y-2 text-sm text-[#d7e0f2]">
          <span>节点名称</span>
          <input
            {...form.register('label')}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-[#f3b457]"
          />
        </label>
        <label className="block space-y-2 text-sm text-[#d7e0f2]">
          <span>主提示词</span>
          <textarea
            {...form.register('prompt')}
            rows={6}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-[#f3b457]"
          />
        </label>
        <label className="block space-y-2 text-sm text-[#d7e0f2]">
          <span>风格补充</span>
          <input
            {...form.register('style')}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-[#f3b457]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-[#f3b457] px-4 py-3 text-sm font-semibold text-[#0e1324] transition hover:bg-[#ffd082]"
        >
          更新节点
        </button>
      </form>
    </ShellCard>
  );
};
