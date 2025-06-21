import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../libs/firebase/firebase-config';
import { FaGoogle } from 'react-icons/fa';

export const Login = () => {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('ログイン成功:', result.user);
      navigate('/home');
    } catch (error) {
      console.error('ログイン失敗:', error);
      alert('ログインに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white text-gray-800 rounded-lg shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
          ログイン
        </h1>
        <p className="text-md text-gray-600 mb-8">
          続行するにはGoogleアカウントでログインしてください。
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <FaGoogle className="w-5 h-5" /> 
          Googleでログイン
        </button>
      </div>
    </div>
  );
};

export default Login;