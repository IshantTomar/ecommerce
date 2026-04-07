import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Page not found</p>

      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
