import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import Title from './Title';
import Logo from './Logo';
const Footer = () => {
//   const navigate = useNavigate();

  const FooterLink = ({ to, children }) => (
    <button
      onClick={() => navigate(to)}
      className="text-orange-50 hover:text-orange-200 transition-all duration-300 transform hover:translate-x-2"
    >
      {children}
    </button>
  );

  const SocialIcon = ({ Icon, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-orange-800 hover:bg-orange-700 rounded-full transition-all duration-300 hover:scale-110"
    >
      <Icon className="w-5 h-5 text-orange-50" />
    </a>
  );

  return (
    <footer className="bg-gradient-to-b from-orange-900 via-orange-950 to-orange-900">
      {/* Wave Separator */}
      <div className="w-full overflow-hidden">
        <svg className="w-full h-12 text-orange-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Brand Section */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-2 flex justify-center items-center">
                <Logo classname="w-40" />
              <Title children="dalTadka" classname="text-6xl lg:text-8xl font-fraunces text-orange-50 font-bold tracking-tight" />
              
            </div>
            <div className="space-y-2">
              <p className="text-3xl text-orange-200 font-semibold">~ Ghar Ka Khana ~</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-orange-50">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-sm text-orange-200">Mon-Sun: 9AM - 10PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-orange-50">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Call Us</p>
                  <p className="text-sm text-orange-200">+91 1234567890</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-orange-50">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-sm text-orange-200">Vidyanagar, Anand</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-orange-50">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-orange-200">info@momskitchen.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid md:grid-cols-4 gap-8 py-8 border-t border-b border-orange-800">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-orange-50 font-fraunces">Menu</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <FooterLink to="/menu">Today's Special</FooterLink>
              <FooterLink to="/menu">Main Course</FooterLink>
              <FooterLink to="/menu">Desserts</FooterLink>
              <FooterLink to="/menu">Beverages</FooterLink>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-orange-50 font-fraunces">About</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <FooterLink to="/about">Our Story</FooterLink>
              <FooterLink to="/team">Team</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-orange-50 font-fraunces">Support</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <FooterLink to="/faq">FAQs</FooterLink>
              <FooterLink to="/terms">Terms & Conditions</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/feedback">Feedback</FooterLink>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-orange-50 font-fraunces">Connect</h3>
            <div className="flex space-x-4">
              <SocialIcon Icon={Instagram} href="#" />
              <SocialIcon Icon={Facebook} href="#" />
              <SocialIcon Icon={Twitter} href="#" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-orange-200">Subscribe to our newsletter for updates and special offers!</p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-orange-800 text-orange-50 placeholder-orange-300 rounded-l focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="px-4 py-2 bg-orange-600 text-orange-50 rounded-r hover:bg-orange-500 transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 text-center">
          <p className="text-sm text-orange-200">
            © {new Date().getFullYear()} Mom's Kitchen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;