import type { GenerateImageInput, GenerateResult } from '@hongflow/shared';

export interface ProviderAdapter {
  id: string;
  label: string;
  generateImage: (
    input: GenerateImageInput,
    options?: {
      apiKey?: string;
      endpoint?: string;
    },
  ) => Promise<GenerateResult>;
}

const buildMockImages = (input: GenerateImageInput): GenerateResult['images'] => {
  const count = input.count ?? 4;

  return Array.from({ length: count }, (_, index) => ({
    localPath: `/generated/mock-${Date.now()}-${index + 1}.png`,
    width: input.width ?? 1024,
    height: input.height ?? 1024,
    metadata: {
      prompt: input.prompt,
      style: input.style ?? 'studio',
      provider: 'mock',
      index: index + 1,
    },
  }));
};

export const mockProvider: ProviderAdapter = {
  id: 'mock',
  label: 'Mock Provider',
  async generateImage(input) {
    return {
      images: buildMockImages(input),
      raw: {
        simulated: true,
      },
    };
  },
};

export const openAIProvider: ProviderAdapter = {
  id: 'openai',
  label: 'OpenAI Images',
  async generateImage(input, options) {
    if (!options?.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured.');
    }

    return {
      images: buildMockImages(input).map((image) => ({
        ...image,
        metadata: {
          ...image.metadata,
          provider: 'openai',
        },
      })),
      raw: {
        provider: 'openai',
        note: 'Scaffold adapter placeholder. Replace with real API integration in Phase 3.',
      },
    };
  },
};

export const providerRegistry: ProviderAdapter[] = [mockProvider, openAIProvider];

export const resolveProvider = (providerId: string): ProviderAdapter => {
  const provider = providerRegistry.find((entry) => entry.id === providerId);

  if (!provider) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  return provider;
};
