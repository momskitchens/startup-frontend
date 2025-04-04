import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {logout as momLogout} from "../../store/momAuthSlice.js" // Adjust the import path as needed

function MomProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Get mom data from Redux store
  let momData = useSelector((state) => state.momAuth.momData);
  momData = momData.data
  console.log(momData)
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: momData?.username || '',
    number: momData?.number || '',
    description: momData?.description || '',
    address: {
      line1: momData?.address?.line1 || '',
      city: momData?.address?.city || '',
      state: momData?.address?.state || '',
      pincode: momData?.address?.pincode || '',
    },
    avatar: momData?.avatar || ''
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        avatarPreview: reader.result,
        avatarImage: file
      });
    };
    reader.readAsDataURL(file);
  };
  
  // Update profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      
      // Add address fields
      formDataToSend.append('line1', formData.address.line1);
      formDataToSend.append('city', formData.address.city);
      formDataToSend.append('state', formData.address.state);
      formDataToSend.append('pincode', formData.address.pincode);
      
      // Add avatar if changed
      if (formData.avatarImage) {
        formDataToSend.append('avatar', formData.avatarImage);
      }
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update the Redux store with new data
      // This would require a proper action in your Redux setup
      // dispatch(updateMomData(data.data));
      
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try{
    const reponse = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/logout`,{
      method:"POST",
      credentials: "include"
    })
    if(!reponse.ok){
      throw new Error(reponse.message || 'Failed to update profile');
    }
    dispatch(momLogout());
    navigate('/mom/login');
    setSuccess('Loging out succesfully!')
  }catch(err){
    setError(err.message || "Something went wrong while logout");
  }finally{
    setLoading(false)
  }
  };
  
  if (!momData) {
    return (
      <div className="bg-orange-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">No profile data found</h2>
          <p className="text-gray-600">Please login to view your profile.</p>
          <button
            onClick={() => navigate('/mom/login')}
            className="mt-4 w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-orange-50 min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">My Profile</h1>
        
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-700">
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
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="relative">
            <div className="bg-orange-600 h-32"></div>
            <div className="flex flex-col items-center pb-6">
              <div className="relative -mt-16 mb-4">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white bg-orange-100">
                  <img 
                    src={formData.avatarPreview || formData.avatar || '/default-avatar.png'} 
                    alt={`${momData.username}'s avatar`} 
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = '/default-avatar.png' }}
                  />
                </div>
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{momData.username}</h2>
              <p className="text-gray-600">{momData.number}</p>
            </div>
          </div>
          
          {/* Edit/Save Button */}
          <div className="px-6 pb-6 flex justify-end">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {/* Profile Information */}
          <div className="px-6 pb-6">
            <form>
              {/* Description */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  About Me
                </label>
                {isEditing ? (
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Tell customers about yourself and your cooking..."
                  />
                ) : (
                  <p className="text-gray-600">{momData.description || "No description provided"}</p>
                )}
              </div>
              
              {/* Address Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.line1">
                      Address Line
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address.line1"
                        name="address.line1"
                        value={formData.address.line1}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    ) : (
                      <p className="text-gray-600">{momData.address?.line1 || "Not provided"}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.city">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    ) : (
                      <p className="text-gray-600">{momData.address?.city || "Not provided"}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.state">
                      State
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    ) : (
                      <p className="text-gray-600">{momData.address?.state || "Not provided"}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.pincode">
                      Pincode
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address.pincode"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    ) : (
                      <p className="text-gray-600">{momData.address?.pincode || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MomProfile;