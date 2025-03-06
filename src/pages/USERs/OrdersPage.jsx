import React, { useEffect, useState } from 'react';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import OrderMenu from './OrderMenu';
import ConfirmCancel from '../../components/ConfirmCancel';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/your-orders`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      
      // Check if data is an array or if we need to extract the orders array
      const ordersArray = Array.isArray(data) ? data : data.data || [data];
      setOrders(ordersArray);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load your orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Show success message for 3 seconds then hide it
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleOpenCancelConfirm = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelConfirm(true);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders/cancel-order`, {
        method: "PATCH",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error while cancelling order");
      }
      
      await fetchOrders();
      setSuccessMessage("Order cancelled successfully");
      
    } catch (error) {
      setError(error.message || "Failed to cancel Order!");
    } finally {
      setLoading(false);
      setShowCancelConfirm(false);
    }
  };

  if (loading) {
    return (
      <LoadingOverlay text="Your Orders" />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => { setError(null); fetchOrders(); }} 
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 p-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-5xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-orange-600 mb-3">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start exploring our delicious meals!</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-full transition-colors duration-300">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 min-h-screen p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">Your Orders</h1>
        
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-green-700">
              ×
            </button>
          </div>
        )}
        
        <div className="flex flex-col gap-6">
          {orders.map((order, index) => {
            // Safely access nested properties
            const orderStatus = order?.userOrders?.status || 'Processing';
            const quantity = order?.userOrders?.quantity || 1;
            const paymentMethod = order?.userPayments?.paymentMethod || 'N/A';
            const paymentStatus = order?.userPayments?.status || 'N/A';
            const menu = order?.orderMenus || {};
            const amount = menu?.amount || 0;
            const rice = menu?.rice || 'N/A';
            const dal = menu?.dal || 'N/A';
            const roti = menu?.roti || 0;
            
            // Handle arrays that might be stored as strings
            let subji = menu?.subji || [];
            if (subji.length === 1 && subji[0].startsWith('[')) {
              // Convert string representation to array
              subji = subji[0].replace('[', '').replace(']', '').split(',').map(item => item.trim());
            }
            
            let extras = menu?.extra || [];
            if (extras.length === 1 && extras[0].startsWith('[')) {
              // Convert string representation to array
              extras = extras[0].replace('[', '').replace(']', '').split(',').map(item => item.trim());
            }
            
            const createdAt = order?.userOrders?.date || null;
            
            return (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row">
                {/* Status bar - vertical on mobile, horizontal on larger screens */}
                <div className={`py-3 px-4 text-white font-semibold md:w-48 flex md:flex-col items-center justify-center ${
                  orderStatus === 'delivered' ? 'bg-green-600' : orderStatus === 'cancelled' ? 'bg-red-600' : 'bg-orange-600'
                }`}>
                  <span className="text-lg md:text-xl">Status</span>
                  <span className="ml-2 md:ml-0 md:mt-2">{orderStatus.toUpperCase()}</span>
                  {createdAt && (
                    <span className="hidden md:block text-xs mt-4 opacity-80">
                      {formatDate(createdAt)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 p-5">
                  {createdAt && (
                    <p className="text-gray-500 text-sm mb-3 md:hidden">Ordered on: {formatDate(createdAt)}</p>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:gap-8">
                    {/* Order summary */}
                    <div className="mb-4 md:mb-0 md:w-1/3">
                      <h3 className="text-lg font-semibold text-orange-800 mb-3">Order Summary</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <p className="text-gray-500 text-sm">Quantity</p>
                          <p className="font-medium">{quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Amount</p>
                          <p className="font-medium text-orange-800">₹{amount * quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Payment</p>
                          <p className="font-medium">{paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Payment Status</p>
                          <p className={`font-medium ${
                            paymentStatus === 'paid' ? 'text-green-600' : 
                            paymentStatus === 'failed' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {paymentStatus.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order details */}
                    <div className="bg-orange-50 rounded-lg p-4 mb-4 md:mb-0 md:flex-1">
                      <h3 className="text-lg font-semibold text-orange-800 mb-2">Order Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <div className="flex justify-between md:block">
                          <span className="text-gray-600">Rice:</span>
                          <span className="font-medium md:ml-2">{rice}</span>
                        </div>
                        <div className="flex justify-between md:block">
                          <span className="text-gray-600">Dal:</span>
                          <span className="font-medium md:ml-2">{dal}</span>
                        </div>
                        <div className="flex justify-between md:block">
                          <span className="text-gray-600">Roti:</span>
                          <span className="font-medium md:ml-2">{roti} pcs</span>
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 mt-2">
                          <span className="text-gray-600">Subji:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {subji.map((item, idx) => (
                              <span key={idx} className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium">{item}</span>
                            ))}
                          </div>
                        </div>
                        
                        {extras.length > 0 && (
                          <div className="col-span-1 md:col-span-2 mt-2">
                            <span className="text-gray-600">Extras:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {extras.map((item, idx) => (
                                <span key={idx} className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium">{item}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setSelectedMenuId(order?.orderMenus?._id);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 bg-orange-600 text-white hover:bg-orange-700 rounded-full py-2 px-4 transition-colors duration-300">
                      Reorder
                    </button>
                    {orderStatus !== 'delivered' && orderStatus !== 'cancelled' && (
                      <button 
                        onClick={() => handleOpenCancelConfirm(order?.userOrders?._id)} 
                        className="flex-1 border border-orange-600 text-orange-600 hover:bg-orange-50 rounded-full py-2 px-4 transition-colors duration-300"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Order Menu Modal */}
      <OrderMenu 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMenuId(null);
        }}
        menuId={selectedMenuId}
      />
      
      {/* Cancel Confirmation Modal */}
      <ConfirmCancel
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelOrder}
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default OrderPage;