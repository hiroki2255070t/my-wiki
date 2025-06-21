import { FaSpinner } from 'react-icons/fa';
import React from 'react';

export const Loading = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <FaSpinner className="animate-spin text-blue-500 w-12 h-12 mb-4" />
      {children}
    </div>
  );
};
