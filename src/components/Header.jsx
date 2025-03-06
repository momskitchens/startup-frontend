import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import Title from './Title';
import { IoMdClose } from "react-icons/io";
import AOS from 'aos';
import Logo from './Logo';


function Header() {
  const authStatus = useSelector((state) => state.userAuth.status);
  // const userData = useSelector((state)=>state.userAuth.userData)
  const momAuthStatus = useSelector((state) => state.momAuth.status);
  
  // console.log(authStatus)
  // console.log(userData)
  
  const [activeItem, setActiveItem] = useState('');
  const [isSideMenuOpen, setMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  const navItems = [
    //user
    { name: 'Dashboard', slug: '/', active: !authStatus && !momAuthStatus },
    { name: 'Home', slug: '/user/home', active: authStatus },
    { name: 'Menu', slug: '/menu', active: authStatus },
    { name: 'Moms', slug: '/moms', active: authStatus },
    { name: 'Orders', slug: '/orders', active: authStatus },
    { name: 'Login', slug: '/login', active: !authStatus && !momAuthStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus && !momAuthStatus },
    //mom
    { name: 'Home', slug: '/mom/home', active: momAuthStatus },
    { name: 'Orders', slug: '/mom/orders', active: momAuthStatus },
    { name: 'Payments', slug: '/mom/payments', active: momAuthStatus },
    { name: 'Menus', slug: '/mom/menus', active: momAuthStatus },
    { name: 'Profile', slug: '/mom/profile', active: momAuthStatus },
  ];

  const handleClick = (slug, name) => {
    setActiveItem(name);
    navigate(slug);
  };

  return (
    <header className="fixed w-full z-10 rounded-md bg-orange-200">
      <nav className="flex justify-between items-center px-6 sm:px-10 py-4 text-black">
        {/* Left Section */}
        <div className="flex flex-row items-center gap-1">
          {/* Hamburger Icon */}
          <FiMenu
            onClick={() => setMenu(true)}
            className="text-3xl sm:hidden cursor-pointer"
          />
          {/* Title */}

          <Logo classname="w-20 h-16  object-contain" />
          <Title children="dalTadka" classname=" text-3xl font-bold" />
        </div>

        {/* Center Section - Navigation Links */}
        <ul className="hidden sm:flex items-center space-x-6">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => handleClick(item.slug, item.name)}
                  className={`font-bold px-4 py-2 duration-200 rounded-full ${
                    activeItem === item.name
                      ? ' text-orange-950'
                      : 'hover:bg-orange-950 hover:text-orange-200'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}
        </ul>

        {/* Right Section - Profile Button */}
        {authStatus && (
          <div>
            <button
              onClick={() => handleClick('/user/profile', 'Profile')}
              className="border-2 border-orange-100 rounded-xl font-bold px-5 py-2 hover:bg-orange-950 bg-orange-200 hover:text-white"
            >
              Profile
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Side Menu */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          data-aos="fade-left"
          data-aos-offset="2000"
          data-aos-delay="100000"
          data-aos-duration="100000"
          data-aos-easing="ease-in-out"
        >
          <aside className="text-black bg-orange-200 flex-col absolute left-0 top-0 h-screen p-8 w-3/4 flex">
            <IoMdClose
              onClick={() => setMenu(false)}
              className="text-3xl cursor-pointer text-white mb-8"
            />
            <Title children="dalTadka" classname=" text-2xl mb-4 font-bold" />
            <ul className="space-y-4">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        handleClick(item.slug, item.name);
                        setMenu(false); // Close menu after navigation
                      }}
                      className={`block font-bold px-4 py-2 w-full text-left rounded-full ${
                        activeItem === item.name
                          ? ' text-orange-950'
                          : 'hover:bg-orange-950 hover:text-orange-200'
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
            </ul>
          </aside>
        </div>
      )}
    </header>
  );
}

export default Header;
