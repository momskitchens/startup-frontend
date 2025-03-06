import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Loader } from 'lucide-react';
import OrderConfirmation from '../../components/OrderConfirmation';


const OrderMenu = ({ isOpen, onClose, menuId }) => {
  const [menuDetails, setMenuDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(false);
  

  useEffect(() => {
    if (isOpen && menuId) {
      fetchMenuDetails();
      setQuantity(1); // Reset quantity on new menu open
    }
  }, [isOpen, menuId]);

  useEffect(() => {
    if (!isOpen) {
      // Reset the order confirmation state when the modal is closed
      setOrderConfirmation(false);
    }
  }, [isOpen]);

  // Load Razorpay script on mount
  useEffect(() => {
    const loadRazorpay = async () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const fetchMenuDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/menu/menus/${menuId}`);
      if (!response.ok) throw new Error('Failed to fetch menu details');
      const data = await response.json();
      setMenuDetails(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleOrderSuccess = () => {
    setOrderConfirmation(true);

    // Use setTimeout to delay the closing of the modal
    setTimeout(() => {
      onClose(); 
    }, 2500); // Adjust the timing if needed
  };

  const handleConfirmOrderOnline = async () => {
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders/create-order-online`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId, quantity }),
      });

      if (!response.ok) throw new Error('Failed to place order');
      
      const { data } = await response.json();
      if (!data?.order || !data?.razorpayOrder) {
        throw new Error('Invalid response structure from server');
      }
       console.log(data)
      const options = {
        key: "rzp_test_iVk7JJbin1Tdl7",
        order_id: data.razorpayOrder.id,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "dalTadka",
        description: `Order #${data.order._id}`,
        handler: async function(response) {
          try {
            const verifyResponse = await fetch(`${import.meta.env.VITE_BACKEND_API}/payments/verify_payment`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                OrderId: data.order._id,
                razororderId: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) throw new Error('Payment verification failed');
            
            const verificationData = await verifyResponse.json();
            if (verificationData.success) {
              handleOrderSuccess();
            } else {
              throw new Error(verificationData.message || 'Payment verification failed');
            }
          } catch (error) {
            setError("Payment verification error: " + error.message);
          }
        },
        prefill: {
          name: menuDetails?.name || '',
        },
        theme: { color: "#F37254" },
        modal: {
          ondismiss: async function() {
            // Send a request to update the order status to "cancelled"
            try {
              const cancelResponse = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders/cancel-order-online`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: data.razorpayOrder.id }),
              });
              if (!cancelResponse.ok) {
                throw new Error('Failed to cancel order');
              }
              setError('Payment cancelled');
            } catch (error) {
              console.error("Error updating order status:", error.message);
              setError('Failed to update order status');
            }
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message);
    }
  };

  const handleConfirmOrderOffline = async () => {
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders/create-order-offline`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId, quantity }),
      });

      if (!response.ok) throw new Error('Failed to place order');
        
     await fetchMenuDetails();
 
      handleOrderSuccess();

    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
          
          {loading ? (
            <div className="flex justify-center">
              <Loader className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              <p>Error: {error}</p>
              <button 
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          ) : menuDetails && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Confirm Your Order</h2>
              
              {/* Menu Details */}
              <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-gray-800">Menu Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Dal: {menuDetails.dal}</p>
                  <p>Rice: {menuDetails.rice}</p>
                  <p>Subji: {menuDetails.subji?.join(' | ')}</p>
                  <p>Roti: {menuDetails.roti}</p>
                  {menuDetails.extra?.length > 0 && (
                    <p>Extras: {menuDetails.extra.join(' • ')}</p>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-800">Quantity:</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-gray-800">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-800">Total Amount:</span>
                <span className="text-xl font-bold text-orange-500">
                  ₹{(menuDetails.amount || 0) * quantity}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleConfirmOrderOnline}
                  className="w-full bg-orange-500 hover:bg-gray-200 text-white hover:text-orange-500 py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  Pay Online
                </button>
                <button
                  onClick={handleConfirmOrderOffline}
                  className="w-full bg-white hover:bg-orange-500 text-orange-500 hover:text-gray-200 border-2 border-black py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  COD
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {orderConfirmation && (
        <OrderConfirmation />
      )}
    </>
  );
};




export default OrderMenu;