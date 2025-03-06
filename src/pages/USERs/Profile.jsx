import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LoadingOverlay } from '../../components/LoadingSpinner';

const Profile = () => {
  const [user, setUser] = useState(null);
  const userData = useSelector((state) => state.userAuth.userData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    line1: '',
    city: '',
    state: '',
    pincode: '' 
  });
  const [successMessage, setSuccessMessage] = useState('');
 

  useEffect(() => {
    fetchUserProfile();
    
  }, [userData]);

  const fetchUserProfile = () => {
    setUser(userData?.data);
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



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/add-address`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add address');
      }
      
      // Reset form and refresh profile
      setNewAddress({
        line1: '',
        city: '',
        state: '',
        pincode: '',
      });
      setShowAddAddress(false);
      setSuccessMessage('Address added successfully!');
      fetchUserProfile();
      window.location.reload()
    } catch (error) {
      setError(error.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleSetActiveAddress = async (addressId) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/select-address`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to set active address');
      }
      
      fetchUserProfile();
      setSuccessMessage('Default address updated!');
      window.location.reload()
    } catch (error) {
      setError(error.message || 'Failed to set active address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/delete-address`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete address');
      }
      
      fetchUserProfile();
      setSuccessMessage('Address deleted successfully!');
      window.location.reload()
    } catch (error) {
      setError(error.message || 'Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <LoadingOverlay text="Loading Profile" />;
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => { setError(null); fetchUserProfile(); }} 
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">Your Profile</h1>
        
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
        
        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="bg-orange-600 py-4 px-6">
            <h2 className="text-xl font-semibold text-white">Basic Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Full Name</p>
                <p className="font-medium text-lg">{user?.username || 'Not available'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Mobile Number</p>
                <p className="font-medium text-lg">{user?.number || 'Not available'}</p>
              </div>
           
            </div>
          </div>
        </div>
        
        {/* Addresses Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-orange-600 py-4 px-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Your Addresses</h2>
            <button 
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="bg-white text-orange-600 hover:bg-orange-100 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300"
            >
              {showAddAddress ? 'Cancel' : '+ Add New'}
            </button>
          </div>
          
          {/* Add new address form */}
          {showAddAddress && (
            <div className="p-6 border-b border-orange-100">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">Add New Address</h3>
              <form onSubmit={handleAddAddress}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="line1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="line1"
                      name="line1"
                      value={newAddress.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="city">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={newAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="state">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={newAddress.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="pincode">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={newAddress.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-orange-600 text-white hover:bg-orange-700 py-2 px-6 rounded-full transition-colors duration-300"
                    onClick={()=>{handleAddAddress}}
                  >
                    save
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Address list */}
          <div className="p-6">
            {Array.isArray(user?.address) && user?.address.length > 0 ? (
              <div className="space-y-4">
                {user.address?.map((address, index) => (
                  <div 
                    key={address._id || index}
                    className={`border rounded-lg p-4 ${address.active ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                  >
                    
                    <p className="font-medium mb-1">
                      {address.line1}, {address.city}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      {address.state} - {address.pincode}
                      {address.landmark && `, Near ${address.landmark}`}
                    </p>
                    <div className="flex gap-3">
                      {!address.active && (
                        <button
                          onClick={() => handleSetActiveAddress(address._id)}
                          className="text-sm text-orange-600 hover:text-orange-800 cursor-pointer"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
                     
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any saved addresses.</p>
                {!showAddAddress && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="bg-orange-600 text-white hover:bg-orange-700 py-2 px-6 rounded-full transition-colors duration-300"
                  >
                    Add Your First Address
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;