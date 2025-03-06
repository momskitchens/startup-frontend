import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Clock, MapPin, ChefHat } from 'lucide-react';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import OrderMenu from "./OrderMenu.jsx"
const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/menu/menus`);
      if (!response.ok) throw new Error('Failed to fetch menus');
      const data = await response.json();
      setMenus(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay text="Loading menus" />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-red-500">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 ">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">Today's Home-Cooked Meals</h1>
          <p className="text-lg text-orange-600">Fresh, authentic meals prepared with love</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap- 6 m-6">
            {menus.map((menu) => (
              <div
                key={menu._id}
                className="bg-white/95 backdrop-blur rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all duration-300 m-5"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500">
                      <img src="/stock/7.jpg" alt="Chef" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-800">Mamta Banerjee</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <MenuItem icon={<ChefHat />} items={[`Dal: ${menu.dal}`, `Rice: ${menu.rice}`]} />
                    <MenuItem icon={<ChefHat />} items={[`Subji: ${menu.subji.join('|')}`]} />
                    <MenuItem icon={<ChefHat />} items={[`Roti: ${menu.roti}`]} />
                    {menu.extra.length > 0 && (
                      <MenuItem icon={<ChefHat />} items={[`Extras: ${menu.extra.join(' • ')}`]} />
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">30 mins</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-500">₹{menu.amount}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMenuId(menu._id);
                      setIsModalOpen(true);
                    }}
                   className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                   >
                    <ShoppingBag className="w-5 h-5" />
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
    <OrderMenu 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMenuId(null);
        }}
        menuId={selectedMenuId}
      />

    
    </div>
  );
};

const MenuItem = ({ icon, items }) => (
  <div className="flex items-start gap-2">
    <span className="text-orange-500 mt-1">{icon}</span>
    <div className="text-gray-700 text-sm">{items.join(' | ')}</div>
  </div>
);
export default MenuPage;