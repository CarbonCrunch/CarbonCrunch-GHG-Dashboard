import React from 'react';

const ComingSoon = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="text-gray-600 mb-6">
          We're working on something amazing. Stay tuned!
        </p>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
