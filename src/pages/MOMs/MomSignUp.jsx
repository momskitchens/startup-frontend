import React, { useDebugValue, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

const MomSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    number: '',
    line1: '',
    state: '',
    city: '',
    pincode: '',
    description: '',
    avatarImage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'number') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'zipcode') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatarImage: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInitialSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    
    if (formData.number.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (formData.pincode && formData.pincode.length !== 6) {
      setError('Please enter a valid 6-digit zipcode');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/register`, {
        method: 'POST',
        credentials: "include",
        body: formDataToSend
      });
  
      const data = await response.json();
      console.log(data)
  
      if (response.ok) {
       setSuccessMessage('Account created successfully! login to continue');
      
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server connection failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950 flex items-center justify-center p-10">
      <div className="max-w-2xl w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-orange-100 mb-2">Create MOM's Account</h2>
          <p className="text-orange-200">Join for eating ghar ka khana</p>
        </div>

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
          <div className="bg-red-500/10 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={ handleInitialSubmit} className="space-y-6">
       
            <div className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-orange-950/50 border-2 border-orange-400 flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-12 h-12 text-orange-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="absolute inset-0 rounded-full cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username Input */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-orange-200 mb-2">
                    Username*
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 placeholder-orange-400"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                {/* Phone Number Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-orange-200 mb-2">
                    Phone Number*
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-orange-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      className="block w-full pl-12 pr-4 py-3 bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 placeholder-orange-400"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Address Line 1 */}
                <div className="md:col-span-2">
                  <label htmlFor="line1" className="block text-sm font-medium text-orange-200 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="line1"
                    name="line1"
                    value={formData.line1}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 placeholder-orange-400"
                    placeholder="Enter your street address"
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-orange-200 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 placeholder-orange-400"
                    placeholder="Enter your city"
                  />
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-orange-200 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 placeholder-orange-400"
                    placeholder="Enter your state"
                  />
                </div>

                {/* Zipcode */}
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-orange-200 mb-2">
                    pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 placeholder-orange-400"
                    placeholder="Enter pincode"
                    maxLength={6}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-orange-200 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full px-4 py-3 bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 placeholder-orange-400 resize-none"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </div>
            </div>
        

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
             'Sign Up'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-orange-200">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MomSignUp;