
// pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
      <div className="absolute">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Lost in Space?</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound