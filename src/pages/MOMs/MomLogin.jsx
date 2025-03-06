import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../../Appwrite/authOtp';
import { login as storeLogin } from '../../store/momAuthSlice.js';

const MomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ number: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const handleNumberSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.number.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const number = formData.number.trim().replace(/\D/g, '');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {number} ),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data.user);
        const tokenGenerate = await authService.login(data.data.user._id, data.data.user.number);
        if (tokenGenerate) {
          setShowOTP(true);
        } else {
          setError('Failed to generate OTP');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.takeOtp(user._id, otpString);
      
      if (response) {
        dispatch(storeLogin({ userData: user }));
        navigate('/mom/home');
  
      } else {
        const errorLogin = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        setError('Invalid OTP');

        if(!errorLogin.ok){
          setError("Server Issue on logout handling wrong otp")
        }
      }
    } catch (err) {
      setError('Failed to verify OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-orange-100 mb-2">Welcome Back!! MOM's Login</h2>
          <p className="text-orange-200 mt-2">Login to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={showOTP ? handleOTPSubmit : handleNumberSubmit} className="space-y-6">
          {!showOTP ? (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-orange-200 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-orange-200">
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  value={formData.number}
                  onChange={(e) => setFormData({ number: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="block w-full pl-12 pr-4 py-3 bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 placeholder-orange-400"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <p className="text-orange-200 mt-2">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/mom/signup')}
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                Signup here
              </button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-orange-200 mb-2">
                Enter OTP sent to +91 {formData.number}
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    className="w-12 h-12 text-center bg-orange-950/50 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-100 text-xl"
                    maxLength={1}
                    required
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtp(['', '', '', '', '', '']);
                  setShowOTP(false);
                }}
                className="text-orange-400 hover:text-orange-300 text-sm block mx-auto"
              >
                Change Phone Number
              </button>
            </div>
          )}

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
            ) : showOTP ? 'Verify OTP' : 'Send OTP'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default MomLogin;