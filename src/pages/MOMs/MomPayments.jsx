import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LoadingOverlay } from '../../components/LoadingSpinner';

function MomPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const momData = useSelector((state) => state.momAuth.momData);

  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch all payments for this mom
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/user-payments`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      console.log(data);
      setPayments(data.data || []);
      
      // Calculate total earnings from completed payments
      const completedPayments = data.data.filter(payment => 
        payment.userPayments.status === 'completed'
      );
      const totalAmount = completedPayments.reduce((sum, payment) => {
        // Calculate total amount by multiplying order amount with quantity
        return sum + ((payment.amount || 0) * (payment.quantity || 1));
      }, 0);
      setTotalEarnings(totalAmount);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment status update
  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/payments/complete-payment`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentId})
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      // Update local state to reflect the change
      setPayments(payments.map(payment => 
        payment.userPayments._id === paymentId 
          ? { 
              ...payment, 
              userPayments: { 
                ...payment.userPayments, 
                status: newStatus 
              } 
            } 
          : payment
      ));
      await fetchPayments();
    } catch (err) {
      setError(err.message || 'Failed to update payment status');
      console.error('Error updating payment status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter payments based on status
  const filteredPayments = payments.filter(payment => {
    return payment.userPayments.status === activeTab;
  });

  if (loading && payments.length === 0) {
    return <LoadingOverlay text="Loading Payments" />;
  }

  return (
    <div className="bg-orange-50 min-h-screen p-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">My Payments</h1>
        
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="bg-orange-600 py-4 px-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white">Total Earnings</span>
              <span className="text-2xl font-bold text-white">₹{totalEarnings.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-700">
              ×
            </button>
          </div>
        )}
        
        {/* Tabs for payment status */}
        <div className="bg-white rounded-t-2xl shadow-md overflow-hidden">
          <div className="flex border-b">
            {['pending', 'completed', 'cancel'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`flex-1 py-3 px-4 text-center font-medium capitalize ${
                  activeTab === status
                    ? 'bg-orange-600 text-white'
                    : 'text-orange-800 hover:bg-orange-50'
                }`}
              >
                {status} Payments
              </button>
            ))}
          </div>
        </div>
        
        {/* Payments List */}
        <div className="bg-white rounded-b-2xl shadow-md overflow-hidden mb-8">
          {filteredPayments.length > 0 ? (
            <div className="divide-y divide-orange-100">
              {filteredPayments.map((payment) => (
                <div key={payment.userPayments._id} className="p-4 hover:bg-orange-50">
                  <div className="md:flex md:justify-between md:items-center">
                    <div className="md:flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 mr-2">Order ID:</span>
                        <span className="font-medium">{payment.customerOrderId}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <span className="text-sm text-gray-500 block">Payment Method:</span>
                          <span className="font-medium">{payment.userPayments.paymentMethod}</span>
                        </div>
                  
                        <div>
                          <span className="text-sm text-gray-500 block">Razorpay ID:</span>
                          <span className="font-medium">
                            {payment.userPayments.razorpayId || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-2">
                        <div>
                          <span className="text-sm text-gray-500 block">Payment Date:</span>
                          <span className="font-medium">{formatDate(payment.userPayments.date)}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 block">Status:</span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            payment.userPayments.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.userPayments.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.userPayments.status}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 block">Quantity:</span>
                          <span className="font-medium">{payment.quantity || 1}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 block">Order Amount:</span>
                          <span className="font-medium">₹{(payment.amount || 0).toLocaleString()}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 block">Total Amount:</span>
                          <span className="font-medium">₹{((payment.amount || 0) * (payment.quantity || 1)).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        
                      </div>
                    </div>
                    
                    {activeTab === 'pending' && (
                      <div className="mt-4 md:mt-0 flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(payment.userPayments._id, 'completed')}
                          className="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded font-medium"
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💸</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No {activeTab} payments</h3>
              <p className="text-gray-600">
                {activeTab === 'pending' 
                  ? 'There are no pending payments at the moment.' 
                  : activeTab === 'completed'
                    ? 'You haven\'t received any completed payments yet.'
                    : 'There are no failed payments.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MomPayments;