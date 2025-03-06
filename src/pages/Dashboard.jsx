import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { Button } from '../components/Button.jsx';
import { useNavigate } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';

function Dashboard() {
  const navigate = useNavigate();
  const [time, setTime] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => !prevTime);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-whit overflow-x-hidden">
      {/* Hero Section */}
      
      <div className="relative min-h-[80vh] bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNiA2LTIuNjg2IDYtNi0yLjY4Ni02LTYtNnptMCAxMGMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6IiBmaWxsPSIjZmJkMzg0IiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-10" />

      <div className="container mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-16">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-300" />
            <img 
              src="./stock/9.jpg" 
              alt="Delicious Dal Tadka"
              className="relative w-4/5 md:w-3/4 rounded-lg shadow-2xl transform transition-transform duration-700 hover:scale-105 object-cover aspect-square"
              style={{
                animation: isVisible ? 'float 6s ease-in-out infinite' : 'none'
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-8">
          <div className="space-y-6">
            {/* Title with animated gradient */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider bg-gradient-to-r from-orange-200 via-orange-100 to-orange-300 text-transparent bg-clip-text animate-gradient">
              dalTadka
            </h1>

        
            {/* Buttons with hover effects */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8">
             

              <Button children="Join as Mom" classname=' bg-orange-200 rounded-lg text-orange-950 transition duration-300 ease-out hover:bg-orange-900 hover:text-orange-200 '   onClick={() => navigate('/mom/login')}/>
              <Button children="Order Now"   onClick={() => navigate('/menu')}/>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s linear infinite;
        }

        .animate-lineGrow {
          animation: lineGrow 1.5s ease-out forwards;
          animation-delay: 0.5s;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes lineGrow {
          from { width: 0; }
          to { width: 60%; }
        }
      `}</style>
    </div>
    

      {/* About Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-24">
          <div className="w-auto md:w-1/2 sm:order-2" data-aos="fade-left">
            <img 
              src="./stock/11.avif" 
              alt="About Us" 
              className="rounded-2xl shadow-xl  h-[400px] object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6" data-aos="fade-right">
            <Title classname="text-4xl text-orange-950 font-bold" children="Our Story" />
            <p className="text-gray-700 text-lg leading-relaxed">
              At dalTadka, we believe in the magic of homemade food. Every dish is crafted with love 
              and care, using traditional recipes passed down through generations. Our commitment is 
              to bring the authentic taste of home-cooked meals right to your doorstep.
            </p>
            <Button 
              children="Learn More"
              classname="bg-orange-950 text-white px-8 py-3 rounded-lg hover:bg-orange-900 transition-colors"
              onClick={() => navigate('/about-us')}
            />
          </div>
        </div>
      </section>

      {/* Timing Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-orange-100/50 to-white">
  <div className="max-w-6xl mx-auto">
    {/* Title Animation */}
    <div className="text-center mb-16" data-aos="fade-up">
      <h2 className="text-4xl md:text-6xl font-bold font-fraunces text-orange-950 mb-4">
        {time ? "~ Dinner Time ~" : "~ Lunch Time ~"}
      </h2>
      <p className="text-orange-800/70 text-lg">Plan your meals with our convenient delivery schedule</p>
    </div>

    {/* Time Cards Container */}
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Order Card */}
      <div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        data-aos="fade-right"
      >
        <div className="bg-orange-950 py-4">
          <h3 className="text-white text-center text-2xl font-semibold">Order Window</h3>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <svg 
              className="w-8 h-8 text-orange-500 mr-3" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-2xl font-bold text-gray-800">
              {time ? "5:00 PM - 7:00 PM" : "9:00 AM - 11:00 AM"}
            </span>
          </div>
          <p className="text-center text-gray-600">
            Place your order during this window to ensure timely delivery
          </p>
        </div>
      </div>

      {/* Delivery Card */}
      <div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        data-aos="fade-left"
      >
        <div className="bg-orange-950 py-4">
          <h3 className="text-white text-center text-2xl font-semibold">Delivery Time</h3>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <svg 
              className="w-8 h-8 text-orange-500 mr-3" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span className="text-2xl font-bold text-gray-800">
              {time ? "9:00 PM - 10:00 PM" : "1:00 PM - 2:00 PM"}
            </span>
          </div>
          <p className="text-center text-gray-600">
            Fresh, hot meals delivered right to your doorstep
          </p>
        </div>
      </div>
    </div>

    {/* Additional Info */}
    <div 
      className="mt-12 text-center bg-orange-100/50 rounded-xl p-6 max-w-2xl mx-auto"
      data-aos="fade-up"
    >
      <div className="flex items-center justify-center mb-4">
        <svg 
          className="w-6 h-6 text-orange-500 mr-2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className="text-lg font-semibold text-orange-950">Important Note</span>
      </div>
      <p className="text-gray-700">
        Orders outside the specified time window may be scheduled for the next available delivery slot
      </p>
    </div>

    {/* Call to Action */}
    <div className="mt-12 text-center" data-aos="fade-up">
    <Button 
              children="Place your Order"
              classname="bg-orange-950 text-white px-8 py-3 rounded-lg hover:bg-orange-900 transition-colors"
              onClick={() => navigate('/about-us')}
            />
    </div>
  </div>
</section>
  {/* Top Seller's Mom Section */}
<section className="py-24 px-4 bg-orange-50">
  <div className="container mx-auto text-center mb-16">
    <Title
      classname="text-4xl text-orange-950 font-bold mb-6"
      children="Top Seller's Mom"
    />
    <p className="text-gray-700 max-w-2xl mx-auto">
      Meet the incredible moms behind our best-selling dishes. Their love and expertise bring every meal to life!
    </p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        data-aos="fade-up"
        data-aos-delay={item * 100}
      >
        {/* Profile Image */}
        <img
          src={`./stock/mom${item}.jpeg`} // Replace with actual image paths
          alt={`Mom ${item}`}
          className="w-full h-56 object-cover"
        />
        {/* Mom's Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-orange-950 mb-2">Mom {item}</h3>
          <p className="text-gray-600 mb-4">
            Famous for her mouthwatering {item === 1 ? 'Butter Chicken' : item === 2 ? 'Paneer Tikka' : 'Rajma Chawal'}.
          </p>
          {/* Ratings and Order Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-orange-500">
              <span className="text-lg font-bold">4.{item} </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.562 4.793h5.033c.969 0 1.371 1.24.588 1.81l-4.073 2.96 1.563 4.794c.3.921-.755 1.688-1.538 1.116L10 13.011l-4.075 2.96c-.782.571-1.837-.195-1.538-1.116l1.562-4.794-4.073-2.96c-.783-.57-.38-1.81.588-1.81h5.033l1.562-4.793z" />
              </svg>
            </div>
            <Button 
              children="Profile"
              classname="bg-orange-950 text-white px-8 py-3 rounded-lg hover:bg-orange-900 transition-colors"
              onClick={() => navigate('/about-us')}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Mom Login*/}
      <section className="py-24 px-4 bg-orange-50">
        <div className="container mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="w-full md:w-1/2" data-aos="fade-left">
            <img 
              src="./stock/13.jpg" 
              alt="Our Chef" 
              className="rounded-2xl shadow-xl m-auto object-fill"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6" data-aos="fade-right">
            <Title classname="text-4xl text-orange-950 font-bold" children="Join as MOM" />
            <p className="text-gray-700 text-lg leading-relaxed">
              With over 15 years of experience in traditional Indian cuisine, our chef brings 
              authentic flavors and cooking techniques to every dish. Join us in celebrating 
              the art of home cooking.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Set menu in order time & earn money on daily basis per order.

            </p>
            <Button 
              children="sign-up"
              classname="bg-orange-950 text-white px-8 py-3 rounded-lg hover:bg-orange-900 transition-colors"
              onClick={() => navigate('')}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <Title classname="text-4xl text-orange-950 font-bold text-center mb-16" children="What Our Customers Say" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="bg-orange-50 p-6 rounded-xl"
                data-aos="fade-up"
                data-aos-delay={item * 100}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-200 rounded-full"></div>
                  <div className="ml-4">
                    <h4 className="font-bold text-orange-950">Customer Name</h4>
                    <p className="text-gray-600 text-sm">Regular Customer</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The food reminds me of my mother's cooking. Absolutely delicious and always delivered on time!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-orange-950">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl text-orange-200 font-bold mb-8">
            Ready to Experience Home-Cooked Goodness?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Order now and get your favorite meals delivered right to your doorstep
          </p>
          <Button 
            children="Order Now"
            classname="bg-orange-200 text-orange-950 px-12 py-4 rounded-lg hover:bg-white transition-colors text-lg font-semibold"
          />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;