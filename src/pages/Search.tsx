import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmbedding } from '../hooks/useEmbedding';
import { DocumentEmbedding } from '../types/documentEmbedding';
import { Loading } from '../components/Loading';
import { ErrorPage } from './ErrorPage';
import { generateDocumentEmbeddings } from '../function/generateDocumentEmbeddings';
import { initializeExtractor } from '../libs/huggingface/extractor';
import { getBookTitleByISBN } from '../function/getBookTitleByISBN';

// コサイン類似度を計算する関数
function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dot / (normA * normB);
}

export const Search = () => {
  const [documentEmbeddings, setDocumentEmbeddings] = useState<
    DocumentEmbedding[]
  >([]);
  const [text, setText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [topDocs, setTopDocs] = useState<string[]>([]);
  const [docLoading, setDocLoading] = useState(true);
  const [docError, setDocError] = useState<Error | null>(null);

  // プログレスバーの状態管理
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentDownloadFile, setCurrentDownloadFile] = useState('');
  const [isExtractorInitializing, setIsExtractorInitializing] = useState(true);

  // ドキュメント埋め込みの取得とExtractor初期化
  useEffect(() => {
    let isMounted = true;

    const handleProgress = (data: any) => {
      if (!isMounted) return;
      if (
        data.status === 'initiate' ||
        data.status === 'download' ||
        data.status === 'progress'
      ) {
        setCurrentDownloadFile(data.file);
        if (data.progress !== undefined) {
          setDownloadProgress(data.progress);
        }
      }
      if (data.status === 'done') {
        setDownloadProgress(100);
        setCurrentDownloadFile('完了');
      }
    };

    const fetchAllData = async () => {
      try {
        setDocLoading(true);
        setDocError(null);

        // Extractorの初期化（一度だけ行われる）
        await initializeExtractor(handleProgress);
        if (isMounted) {
          setIsExtractorInitializing(false);
        }

        // ドキュメント埋め込みの生成/取得（一度だけ行われる）
        const documents = await generateDocumentEmbeddings();
        if (isMounted) {
          setDocumentEmbeddings(documents);
        }
      } catch (e) {
        console.error('Failed to load initial data:', e);
        if (isMounted) {
          setDocError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (isMounted) {
          setDocLoading(false);
        }
      }
    };

    // コンポーネントがマウントされたとき、または初回ロード時のみ実行
    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  const {
    data: userEmbedding,
    loading: userEmbeddingLoading,
    error: userEmbeddingError,
  } = useEmbedding({ text: debouncedText });

  useEffect(() => {
    const searchRelevantDocs = async () => {
      if (!userEmbedding || documentEmbeddings.length === 0) {
        setTopDocs([]);
        return;
      }

      const scored = documentEmbeddings.map((doc) => ({
        path: doc.path,
        score: cosineSimilarity(userEmbedding, doc.embedding),
      }));

      const top = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((doc) => doc.path);

      setTopDocs(top);
    };

    if (!isExtractorInitializing && !docLoading) {
      searchRelevantDocs();
    }
  }, [userEmbedding]);

  if (isExtractorInitializing || userEmbeddingLoading || docLoading) {
    return (
      <Loading>
        {isExtractorInitializing && downloadProgress < 100 && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold mb-2">AIモデルを初期化中...</p>
            {currentDownloadFile && (
              <p className="text-sm text-gray-600 mb-1">
                ファイル: {currentDownloadFile}
              </p>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {downloadProgress.toFixed(0)}%
            </p>
          </div>
        )}
        {!isExtractorInitializing && docLoading && (
          <p className="text-lg font-semibold mt-4">
            ドキュメントの埋め込みを生成中...
          </p>
        )}
      </Loading>
    );
  }

  if (docError) {
    return <ErrorPage error={docError} />;
  }
  if (userEmbeddingError) {
    return <ErrorPage error={userEmbeddingError} />;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          キーワード検索
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="例: スポーツ, プログラミング, 論文の書き方に関する書籍"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </div>
        </div>
      </div>
      {debouncedText && (
        <>
          <h1 className="text-xl font-bold mb-4">
            "{debouncedText}" に関連するドキュメント
          </h1>
          {topDocs.length > 0 ? (
            <ul className="list-none ml-5 space-y-2">
              {topDocs.map((path, index) => {
                const [subPath, filename] = path.split('/');
                return (
                  <Link
                    key={index}
                    to={`/${subPath}/detail/${filename.replace('.md', '')}`}
                    className=""
                  >
                    <div className="flex items-center border border-gray-100 rounded-lg p-4 transition-colors hover:bg-gray-100 cursor-pointer shadow-md m-4">
                      <span className="text-gray-500 font-medium w-6 mr-2">
                        {index + 1}.
                      </span>
                      <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {getBookTitleByISBN(filename.replace('.md', ''))}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 text-center mt-8">
              関連するドキュメントは見つかりませんでした。
            </p>
          )}
        </>
      )}
    </div>
  );
};
