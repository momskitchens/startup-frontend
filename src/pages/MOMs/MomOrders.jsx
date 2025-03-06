import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LoadingOverlay } from '../../components/LoadingSpinner';

function MomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const momData = useSelector((state) => state.momAuth.momData);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders for this mom
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/user-orders`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log(data);
      setOrders(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update for an order
  const updatetocomplete = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders/delivere-order`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state to reflect the change
      setOrders(orders.map(order => 
        order.momOrders._id === orderId 
          ? { ...order, momOrders: { ...order.momOrders, status: newStatus } } 
          : order
      ));

      fetchOrders();      
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      console.error('Error updating order status:', err);
    } finally {
      setLoading(false);
    }
  };
  // Handle status update for an order
  const updatetocancel = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders/cancel-order`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state to reflect the change
      setOrders(orders.map(order => 
        order.momOrders._id === orderId 
          ? { ...order, momOrders: { ...order.momOrders, status: newStatus } } 
          : order
      ));

      fetchOrders();
      
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      console.error('Error updating order status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ordered' ) {
      return order.momOrders.status === 'ordered';
    } else if (activeTab === 'completed') {
      return order.momOrders.status === 'delivered';
    } else if (activeTab === 'cancelled') {
      return order.momOrders.status === 'cancelled';
    }
    return true;
  });

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

  // Format menu items into readable text
  const formatMenuItems = (menu) => {
    const items = [];
    
    if (menu.dal) items.push(`Dal: ${menu.dal}`);
    if (menu.rice) items.push(`Rice: ${menu.rice}`);
    if (menu.roti) items.push(`Roti: ${menu.roti}`);
    
    if (menu.subji && menu.subji.length > 0) {
      items.push(`Subji: ${menu.subji.join(', ')}`);
    }
    
    if (menu.extra && menu.extra.length > 0) {
      items.push(`Extra: ${menu.extra.join(', ')}`);
    }
    
    return items.join(' • ');
  };

  if (loading && orders.length === 0) {
    return <LoadingOverlay text="Loading Orders" />;
  }

  return (
    <div className="bg-orange-50 min-h-screen p-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">My Orders</h1>
        
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
        
        {/* Tabs for order status */}
        <div className="bg-white rounded-t-2xl shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('ordered')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'text-orange-800 hover:bg-orange-50'
              }`}
            >
              Pending Orders
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'completed'
                  ? 'bg-orange-600 text-white'
                  : 'text-orange-800 hover:bg-orange-50'
              }`}
            >
              Completed Orders
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'cancelled'
                  ? 'bg-orange-600 text-white'
                  : 'text-orange-800 hover:bg-orange-50'
              }`}
            >
              Cancelled Orders
            </button>
          </div>
        </div>
        
        {/* Orders List */}
        <div className="bg-white rounded-b-2xl shadow-md overflow-hidden mb-8">
          {filteredOrders.length > 0 ? (
            <div className="divide-y divide-orange-100">
              {filteredOrders.map((order) => (
                <div key={order.momOrders._id} className="p-4 hover:bg-orange-50">
                  <div className="md:flex md:justify-between md:items-center">
                    <div className="md:flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 mr-2">Customer-Order-ID:</span>
                        <span className="font-medium">{order.momOrders.customerOrderId}</span>
                        
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <span className="text-sm text-gray-500 block">Items:</span>
                          <span className="font-medium">{formatMenuItems(order.momMenus)}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 block">Quantity:</span>
                          <span className="font-medium">{order.momOrders.quantity} x ₹{order.momMenus.amount}</span>
                          <span className="ml-2 font-bold">= ₹{order.momOrders.quantity * order.momMenus.amount}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-2">
                        <div>
                          <span className="text-sm text-gray-500 block">Order Date:</span>
                          <span className="font-medium">{formatDate(order.momOrders.date)}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 block">Status:</span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.momOrders.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : order.momOrders.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.momOrders.status.charAt(0).toUpperCase() + order.momOrders.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {activeTab === 'ordered' && (
                      <div className="mt-4 md:mt-0 flex gap-2">
                        <button
                          onClick={() => updatetocomplete(order.momOrders._id, 'completed')}
                          className="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded font-medium"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updatetocancel(order.momOrders._id, 'cancelled')}
                          className="bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No {activeTab} orders</h3>
              <p className="text-gray-600">
                {activeTab === 'pending' 
                  ? 'There are no pending orders at the moment.' 
                  : activeTab === 'completed'
                    ? 'You haven\'t completed any orders yet.'
                    : 'There are no cancelled orders.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MomOrders;