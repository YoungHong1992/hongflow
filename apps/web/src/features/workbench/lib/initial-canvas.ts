import type { CanvasEdge, CanvasNode } from '../types/canvas.js';

export const initialNodes: CanvasNode[] = [
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

export const initialEdges: CanvasEdge[] = [
  { id: 'e-product-generate', source: 'product', target: 'generate' },
  { id: 'e-prompt-generate', source: 'prompt', target: 'generate' },
  { id: 'e-preset-generate', source: 'preset', target: 'generate' },
  { id: 'e-generate-gallery', source: 'generate', target: 'gallery' },
];

export const categoryPalette = [
  { name: '素材层', ids: ['asset'] },
  { name: '编排层', ids: ['text', 'control', 'generator'] },
  { name: '结果层', ids: ['result', 'export'] },
];
