import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Title from '../../components/Title';
import { Button } from '../../components/Button';

function Home() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userAuth.userData);

  // Use optional chaining to prevent errors
  const address = userData?.data?.address?.filter((address) => address.active === true) || [];

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-24 bg-white">
      <div className="p-2 shadow-2xl m-5 mt-28 bg-orange-200 rounded-2xl">
        <div>
          <button className="text-xs font-bold m-3 text-orange-700">Update Address</button>
          
          {/* Return elements inside map */}
          {address.map((addressItem, index) => (
            <div 
              key={index}
              className="border rounded-lg p-4 bg-orange-50"
            >
              <p className="font-medium mb-1">
                {addressItem.line1}, {addressItem.city}
              </p>
              <p className="text-gray-600 text-sm mb-3">
                {addressItem.state} - {addressItem.pincode}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="m-5 mt-10 text-lg xl:text-2xl font-bold">What's on your mind?</h1>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="sm:w-1/2">
            <div className="sm:w-3/4 m-4 sm:h-auto rounded-md">
              <img
                src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80"
                alt="Delicious home-cooked meal"
                className="rounded-md w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="sm:w-1/2">
            <h2 className="m-5 font-semibold text-md xl:text-2xl text-amber-900">
              Order Lunch and Dinner On Time - Delivered Fresh When You Need It
            </h2>
            <h2 className="m-5 font-semibold text-sm xl:text-lg text-amber-600">
              "Cravings for Ghar Ka Khana!"
              <p>Get your meals delivered perfectly on time, so you can enjoy home-cooked food without the wait.</p>
            </h2>
            <Button
              classname="m-5 p-3 hover:bg-green-300 hover:text-black"
              onClick={() => navigate('/about-us')}
            >
              Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
