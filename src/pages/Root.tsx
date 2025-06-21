import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../libs/firebase/firebase-config';

export const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const timer = setTimeout(() => {
        if (user) {
          // ユーザーがログインしている場合
          console.log('User is logged in, redirecting to /home');
          navigate('/home');
        } else {
          // ユーザーがログインしていない場合、このページに留まる
          console.log('User is not logged in. Staying on Root page.');
        }
      }, 200);

      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-800 p-4">
      <div className="bg-white text-gray-800 rounded-lg shadow-xl p-8 max-w-sm w-full text-center transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-700">
          ようこそ！
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          私のWikiへ
        </p>
        
        <div className="space-y-4">
          <Link
            to="/home"
            className="block w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            ログインせずに進む
          </Link>
          <p className="text-sm text-gray-500">または</p>
          <Link
            to="/login"
            className="block w-full py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-gray-50"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
};