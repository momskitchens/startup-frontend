import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingOverlay } from '../../components/LoadingSpinner';

function MomHome() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/mom-home`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      // Extract the actual data from the nested structure
      // The structure is: { statusCode, data: [{ _id, totalOrders, momMenus, averageRating, latestRatings }], message, success }
      const momData = responseData.data?.[0] || {};
      
      // Extract and flatten the first array of menus if it exists
      // The structure of momMenus is: [[menu1, menu2], [menu1, menu2]]
      const menus = momData.momMenus?.[0] || [];
      
      const normalizedData = {
        _id: momData._id,
        totalOrders: momData.totalOrders || 0,
        momMenus: menus,
        averageRating: momData.averageRating,
        latestRatings: momData.latestRatings || []
      };
      
      console.log('Normalized data:', normalizedData);
      setDashboardData(normalizedData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format menu items into readable text
  const formatMenuItems = (menu) => {
    const items = [];
    
    if (menu.dal) items.push(`Dal: ${menu.dal}`);
    if (menu.rice) items.push(`Rice: ${menu.rice}`);
    if (menu.roti) items.push(`Roti: ${menu.roti || 0}`);
    
    if (menu.subji && menu.subji.length > 0) {
      items.push(`Subji: ${menu.subji.join(', ')}`);
    }
    
    if (menu.extra && menu.extra.length > 0) {
      items.push(`Extra: ${menu.extra.join(', ')}`);
    }
    
    return items.join(' • ');
  };

  // Get active menus
  const activeMenus = dashboardData?.momMenus?.filter(menu => menu.active) || [];

  // Format date from MongoDB ObjectId
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // Handle both date string and MongoDB date object formats
      const date = dateString.$date ? new Date(dateString.$date) : new Date(dateString);
      return date.toLocaleDateString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'N/A';
    }
  };

  if (loading && !dashboardData) {
    return <LoadingOverlay text="Loading Dashboard" />;
  }

  return (
    <div className="bg-orange-50 min-h-screen p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">Dashboard</h1>
        
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
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <div className="text-4xl text-orange-600 mb-2">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-orange-800">{dashboardData?.totalOrders || 0}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <div className="text-4xl text-orange-600 mb-2">🍲</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Active Menus</h3>
            <p className="text-3xl font-bold text-orange-800">{activeMenus.length || 0}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <div className="text-4xl text-orange-600 mb-2">⭐</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Average Rating</h3>
            <p className="text-3xl font-bold text-orange-800">
              {dashboardData?.averageRating ? dashboardData.averageRating.toFixed(1) : 'N/A'}
            </p>
          </div>
        </div>
        
        {/* Menu Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-orange-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-orange-800">Your Menus</h2>
            <button 
              onClick={() => navigate('/mom/menus')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Manage Menus
            </button>
          </div>
          
          <div className="p-4">
            {dashboardData?.momMenus?.length > 0 ? (
              <div className="divide-y divide-orange-100">
                {dashboardData.momMenus.slice(0, 3).map((menu) => (
                  <div key={menu._id.$oid || menu._id} className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span 
                          className={`w-3 h-3 rounded-full mr-2 ${menu.active ? 'bg-green-500' : 'bg-red-500'}`}
                        ></span>
                        <span className="font-medium">
                          {menu.active ? 'Active Menu' : 'Inactive Menu'}
                        </span>
                      </div>
                      <span className="font-bold text-orange-800">₹{menu.amount}</span>
                    </div>
                    
                    <p className="text-gray-700 text-sm">{formatMenuItems(menu)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-600 mb-4">You haven't added any menus yet</p>
                <button 
                  onClick={() => navigate('/mom/menus')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Your First Menu
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-orange-100 px-6 py-4">
            <h2 className="text-xl font-bold text-orange-800">Recent Reviews</h2>
          </div>
          
          <div className="p-4">
            {dashboardData?.latestRatings && dashboardData.latestRatings.length > 0 ? (
              <div className="divide-y divide-orange-100">
                {dashboardData.latestRatings.map((rating, index) => (
                  <div key={index} className="py-4">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rating.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {formatDate(rating.date)}
                      </span>
                    </div>
                    <p className="text-gray-700">{rating.comment || "No comment provided"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">
                  As you complete more orders, your customers' reviews will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MomHome;