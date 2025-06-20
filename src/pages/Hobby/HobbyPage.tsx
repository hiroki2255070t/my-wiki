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

export const HobbyPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br px-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 drop-shadow-lg">
        趣味
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        <PageCard path="detail/soccer" title="サッカー" text="⚽️"></PageCard>
        <PageCard path="detail/cycling" title="自転車" text="🚲"></PageCard>
        <PageCard path="detail/sketch" title="絵描き" text="🎨"></PageCard>
      </div>
    </div>
  );
};
