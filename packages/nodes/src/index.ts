import { z } from 'zod';

import type { GenerateResult, NodeCategory } from '@hongflow/shared';

export interface NodeRunContext {
  projectId?: string;
  boardId?: string;
  workflowId?: string;
}

export interface BaseNodeSpec<TInput = unknown, TOutput = unknown> {
  type: string;
  version: string;
  category: NodeCategory;
  title: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  outputSchema: z.ZodType<TOutput>;
  defaultData: Record<string, unknown>;
  run?: (ctx: NodeRunContext, input: TInput) => Promise<TOutput>;
}

const emptyObjectSchema = z.record(z.string(), z.unknown());
const generateResultSchema = z.custom<GenerateResult>();

export const builtInNodeSpecs: BaseNodeSpec[] = [
  {
    type: 'Asset.ProductImage',
    version: '0.1.0',
    category: 'asset',
    title: '商品图',
    description: '商品主素材输入节点',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      assetType: 'product',
      label: 'Product Image',
    },
  },
  {
    type: 'Asset.ReferenceImage',
    version: '0.1.0',
    category: 'asset',
    title: '参考图',
    description: '风格与构图参考素材',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      assetType: 'reference',
      label: 'Reference Image',
    },
  },
  {
    type: 'Asset.BrandImage',
    version: '0.1.0',
    category: 'asset',
    title: '品牌图',
    description: '品牌 logo 与视觉元素输入',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      assetType: 'brand',
      label: 'Brand Image',
    },
  },
  {
    type: 'Text.Prompt',
    version: '0.1.0',
    category: 'text',
    title: 'Prompt',
    description: '主提示词与卖点描述',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      prompt: 'hero product shot, premium lighting, retail-ready composition',
      label: 'Prompt',
    },
  },
  {
    type: 'Text.NegativePrompt',
    version: '0.1.0',
    category: 'text',
    title: 'Negative Prompt',
    description: '负向提示词',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      prompt: 'blurry, distorted packaging, extra limbs, duplicated products',
      label: 'Negative Prompt',
    },
  },
  {
    type: 'Control.ParamPreset',
    version: '0.1.0',
    category: 'control',
    title: '参数模板',
    description: '统一控制尺寸、质量与风格强度',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      width: 1024,
      height: 1024,
      quality: 'high',
      label: 'Preset',
    },
  },
  {
    type: 'Control.BatchVariants',
    version: '0.1.0',
    category: 'control',
    title: '批量变体',
    description: '拆分多版生成任务',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      count: 4,
      label: 'Batch Variants',
    },
  },
  {
    type: 'Generator.ImageGenerate',
    version: '0.1.0',
    category: 'generator',
    title: '图像生成',
    description: '调用 provider 生成商品视觉结果',
    inputSchema: emptyObjectSchema,
    outputSchema: generateResultSchema,
    defaultData: {
      provider: 'mock',
      model: 'image-v1',
      label: 'Generate',
    },
  },
  {
    type: 'Generator.ImageVariation',
    version: '0.1.0',
    category: 'generator',
    title: '图像变体',
    description: '对现有图像生成新构图与新氛围',
    inputSchema: emptyObjectSchema,
    outputSchema: generateResultSchema,
    defaultData: {
      provider: 'mock',
      strength: 0.45,
      label: 'Variation',
    },
  },
  {
    type: 'Result.Gallery',
    version: '0.1.0',
    category: 'result',
    title: '结果画廊',
    description: '预览多图结果并做初步筛选',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      columns: 2,
      label: 'Gallery',
    },
  },
  {
    type: 'Export.ImageBundle',
    version: '0.1.0',
    category: 'export',
    title: '导出图片包',
    description: '导出 PNG / JPG 结果集',
    inputSchema: emptyObjectSchema,
    outputSchema: emptyObjectSchema,
    defaultData: {
      format: 'png',
      label: 'Export Bundle',
    },
  },
];
