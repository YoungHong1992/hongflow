export const resolvePrompt = (nodes: Array<Record<string, unknown>>) => {
  const promptNode = nodes.find((node) => node.type === 'Text.Prompt');

  if (!promptNode || typeof promptNode !== 'object') {
    return 'premium product hero shot, commercial lighting, clean composition';
  }

  const data = promptNode.data as Record<string, unknown> | undefined;

  return typeof data?.prompt === 'string'
    ? data.prompt
    : 'premium product hero shot, commercial lighting, clean composition';
};
