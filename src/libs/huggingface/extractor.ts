import { pipeline, env } from '@xenova/transformers';
env.allowLocalModels = false;

let extractor: any = null;
let initializationPromise: Promise<void> | null = null;

export async function initializeExtractor(
  progress_callback?: (data: any) => void
) {
  if (extractor) {
    console.log('Extractor has already initialized and is ready.');
    return;
  }

  if (initializationPromise) {
    console.log(
      'Extractor initialization is already in progress. Waiting for it to complete...'
    );
    return initializationPromise;
  }

  initializationPromise = (async () => {
    if (!pipeline) {
      console.error('Pipeline is not found.');
      throw new Error('Pipeline not available.');
    }

    const task = 'feature-extraction';
    const model = 'Xenova/all-MiniLM-L6-v2';

    try {
      console.log(
        'Starting Extractor initialization (downloading model if necessary)...'
      );

      extractor = await pipeline(task, model, {
        progress_callback: progress_callback || console.log,
      });
      console.log('Extractor initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize Extractor:', error);
      extractor = null;
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    console.log(
      'Extractor not yet available. Triggering/Waiting for initialization...'
    );
    await initializeExtractor(); // progress_callbackなしで呼び出される場合がある
  }

  if (!extractor) {
    throw new Error('Extractor could not be initialized.');
  }

  try {
    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Embedding generation failed.');
  }
}
