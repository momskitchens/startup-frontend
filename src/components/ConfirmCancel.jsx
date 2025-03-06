import React from 'react';

const ConfirmCancel = ({ isOpen, onClose, onConfirm, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Cancel Order?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full py-2 px-4 transition-colors duration-300"
          >
            No, Keep Order
          </button>
          <button
            onClick={() => onConfirm(orderId)}
            className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-full py-2 px-4 transition-colors duration-300"
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancel;