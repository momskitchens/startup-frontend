import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const CreateMenu = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      rice: '',
      dal: '',
      subji: '',
      roti: '',
      extra: '',
      amount: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const amount = Number(data.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/menu/create-menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          amount: amount
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        reset();
        setTimeout(() => {
          navigate('/mom/menus');
        }, 2000);
        window.location.reload();
      } else {
        setError(result.message || 'Failed to create menu');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-orange-500">
          <h2 className="text-2xl font-semibold text-gray-800">Create Today's Menu</h2>
          <p className="text-gray-600 mt-1">Share your delicious home-cooked meals with customers</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Menu created successfully!</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rice Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rice
                </label>
                <input
                  {...register('rice', { required: 'Rice is required' })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                  placeholder="e.g., Jeera Rice"
                />
                {errors.rice && (
                  <p className="mt-1 text-sm text-red-600">{errors.rice.message}</p>
                )}
              </div>

              {/* Dal Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dal
                </label>
                <input
                  {...register('dal', { required: 'Dal is required' })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                  placeholder="e.g., Toor Dal"
                />
                {errors.dal && (
                  <p className="mt-1 text-sm text-red-600">{errors.dal.message}</p>
                )}
              </div>

              {/* Subji Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subji
                </label>
                <input
                  {...register('subji', { required: 'Subji is required' })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                  placeholder="e.g., Mix Veg"
                />
                {errors.subji && (
                  <p className="mt-1 text-sm text-red-600">{errors.subji.message}</p>
                )}
              </div>

              {/* Roti Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roti
                </label>
                <input
                  {...register('roti', { required: 'Roti is required' })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                  placeholder="e.g., Phulka"
                />
                {errors.roti && (
                  <p className="mt-1 text-sm text-red-600">{errors.roti.message}</p>
                )}
              </div>

              {/* Extra Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extra Items (Optional)
                </label>
                <input
                  {...register('extra')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                  placeholder="e.g., Papad, Salad"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  {...register('amount', { 
                    required: 'Amount is required',
                    min: { value: 1, message: 'Amount must be greater than 0' },
                    pattern: { 
                      value: /^\d+$/, 
                      message: 'Please enter a valid number' 
                    }
                  })}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-400"
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                 <LoadingSpinner text='Creating Menu' />
                   
                ) : (
                  'Create Menu'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMenu;