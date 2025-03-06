import React, { useState, useEffect } from 'react';
import CreateMenu from '../../components/CreateMenu';
import { useSelector } from 'react-redux';
import { LoadingOverlay } from '../../components/LoadingSpinner';

function MomMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const momData = useSelector((state) => state.momAuth.momData);

  useEffect(() => {
    fetchMenus();
  }, []);

  // Fetch all menus created by this mom
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/menu/mom-menus`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menus');
      }

      const data = await response.json();
      console.log(data);
      setMenus(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load menus');
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle toggling menu active status
  const handleToggleActive = async (menuId, currentStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/menu/toggle-active`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ menuId })
      });

      if (!response.ok) {
        throw new Error('Failed to update menu status');
      }

      // Update local state to reflect the change
      setMenus(menus.map(menu => 
        menu._id === menuId ? { ...menu, active: !menu.active } : menu
      ));
      
      setSuccessMessage(`Menu ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchMenus()
    } catch (err) {
      setError(err.message || 'Failed to update menu status');
      console.error('Error toggling menu status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle menu deletion
  const handleDeleteMenu = async (menuId) => {
    if (!confirm('Are you sure you want to delete this menu? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/menu/delete-menu/${menuId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu');
      }

      // Remove the deleted menu from the local state
      setMenus(menus.filter(menu => menu._id !== menuId));
      setSuccessMessage('Menu deleted successfully!');
      fetchMenus()
    } catch (err) {
      setError(err.message || 'Failed to delete menu');
      console.error('Error deleting menu:', err);
    } finally {
      setLoading(false);
    }
  };

   // Handle menu refresh after creation


  // Format menu items into readable text
  const formatMenuItems = (menu) => {
    const items = [];
    
    if (menu.momMenus.dal) items.push(`Dal: ${menu.momMenus.dal}`);
    if (menu.momMenus.rice) items.push(`Rice: ${menu.momMenus.rice}`);
    if (menu.momMenus.roti) items.push(`Roti: ${menu.momMenus.roti}`);
    
    if (menu.momMenus.subji && menu.momMenus.subji.length > 0) {
      items.push(`Subji: ${menu.momMenus.subji.join(', ')}`);
    }
    
    if (menu.momMenus.extra && menu.momMenus.extra.length > 0) {
      items.push(`Extra: ${menu.momMenus.extra.join(', ')}`);
    }
    
    return items.join(' • ');
  };


 

  if (loading && menus.length === 0) {
    return <LoadingOverlay text="Loading Menus" />;
  }

  return (
    <div className="bg-orange-50 min-h-screen p-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">My Menus</h1>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')} className="text-green-700">
              ×
            </button>
          </div>
        )}
        
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
        
        {/* Create Menu Form (Collapsible) */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div 
            className="bg-orange-600 py-3 px-6 flex justify-between items-center cursor-pointer" 
            onClick={() => setShowCreateMenu(!showCreateMenu)}
          >
            <h2 className="text-xl font-semibold text-white">Create New Menu</h2>
            <div className="text-white text-2xl font-bold transform transition-transform duration-200" style={{ transform: showCreateMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </div>
          </div>
          {showCreateMenu && (
            <div className="p-6">
              <CreateMenu   />
            </div>
          )}
        </div>
        
        {/* List of Menus */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-orange-600 py-3 px-6">
            <h2 className="text-xl font-semibold text-white">Your Menus</h2>
          </div>
          
          {menus.length > 0 ? (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-orange-800">#</th>
                      <th className="py-3 px-4 text-left text-orange-800">Items</th>
                      <th className="py-3 px-4 text-left text-orange-800">Price</th>
                      <th className="py-3 px-4 text-center text-orange-800">Status</th>
                      <th className="py-3 px-4 text-center text-orange-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((menu, index) => (
                      <tr key={menu.momMenus._id} className="border-b border-orange-100 hover:bg-orange-50">
                        <td className="py-3 px-4 font-medium">{index + 1}</td>
                        <td className="py-3 px-4 max-w-xs">{formatMenuItems(menu)}</td>
                        <td className="py-3 px-4">₹{menu.momMenus.amount || 0}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            menu.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {menu.momMenus.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleToggleActive(menu.momMenus._id, menu.momMenus.active)}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                menu.momMenus.active
                                  ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {menu.momMenus.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(menu.momMenus._id)}
                              className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No menus created yet</h3>
              <p className="text-gray-600 mb-6">
                Start creating your first menu by clicking "Create New Menu" above!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MomMenus;