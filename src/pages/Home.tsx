import { Link } from 'react-router-dom';

const PageCard = ({
  path,
  title,
  text,
}: {
  path: string;
  title: string;
  text: string;
}) => {
  return (
    <Link
      to={path}
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 text-center border border-gray-100"
    >
      <h2 className="text-xl font-semibold text-indigo-600 mb-2">{title}</h2>
      <p className="text-gray-600">{text}</p>
    </Link>
  );
};

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br px-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 drop-shadow-lg">
        ようこそ
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        <PageCard
          path="/history"
          title="経歴"
          text="私の経歴を紹介します！"
        ></PageCard>
        <PageCard
          path="/books"
          title="本"
          text="私の読書記録を紹介します！"
        ></PageCard>
        <PageCard
          path="/hobby"
          title="趣味"
          text="私の趣味を紹介します！"
        ></PageCard>
        <PageCard
          path="/job"
          title="技術"
          text="私の技術を紹介します！"
        ></PageCard>
      </div>
    </div>
  );
};
