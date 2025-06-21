import { generateEmbedding } from '../libs/huggingface/extractor';
import { DocumentEmbedding } from '../types/documentEmbedding';

const markdownModules = import.meta.glob('../../docs/books/*.md', {
  as: 'raw',
});

// ドキュメント埋め込みのキャッシュを保存するグローバル変数
let cachedDocumentEmbeddings: DocumentEmbedding[] | null = null;
let documentEmbeddingsLoadingPromise: Promise<DocumentEmbedding[]> | null =
  null;

export const generateDocumentEmbeddings = async (): Promise<
  DocumentEmbedding[]
> => {
  if (cachedDocumentEmbeddings) {
    console.log(
      'Document embeddings has already cached. Returning cached data.'
    );
    return cachedDocumentEmbeddings;
  }

  if (documentEmbeddingsLoadingPromise) {
    console.log(
      'Document embeddings are currently loading. Waiting for completion.'
    );
    return documentEmbeddingsLoadingPromise;
  }

  documentEmbeddingsLoadingPromise = (async () => {
    try {
      console.log('Generating document embeddings for the first time...');
      const entries = Object.entries(markdownModules);

      const results = await Promise.all(
        entries.map(async ([path, loadContent]) => {
          try {
            const content = await loadContent();
            const embedding = await generateEmbedding(content);
            return { path: path.replace('../../docs/', ''), embedding };
          } catch (error) {
            console.error(
              `Embedding failed for ${path.replace('../../docs/', '')}:`,
              error
            );
            return null;
          }
        })
      );

      const validResults: DocumentEmbedding[] = results.filter(
        (item): item is DocumentEmbedding => item !== null
      );

      cachedDocumentEmbeddings = validResults;
      documentEmbeddingsLoadingPromise = null;
      console.log('Document embeddings has generated and cached.');
      return validResults;
    } catch (error) {
      console.error('Failed to generate document embeddings:', error);
      cachedDocumentEmbeddings = null;
      documentEmbeddingsLoadingPromise = null;
      throw error;
    }
  })();

  return documentEmbeddingsLoadingPromise;
};
