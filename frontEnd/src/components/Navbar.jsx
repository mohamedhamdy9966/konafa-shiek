import { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    cartItems,
  } = useContext(ShopContext);

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
  }, [cartItems, getCartCount]);

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const navLinks = [
    { to: "/", label: "الصفحة الرئيسية" },
    { to: "/collection", label: "الأصناف" },
    { to: "/about", label: "عن كنافة شيك" },
    { to: "/contact", label: "تواصل معنا" },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={assets.logo} 
              className="w-16 rounded-sm transform transition-transform hover:scale-105" 
              alt="logo" 
            />
          </Link>

          {/* Main Navigation */}
          <ul className="hidden sm:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-black
                  ${isActive ? "text-black" : "text-gray-600"}`
                }
              >
                {({ isActive }) => (
                  <div className="relative">
                    <span>{label}</span>
                    {isActive && (
                      <span className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-200" />
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={() => setShowSearch(true)}
            >
              <img src={assets.search_icon} alt="search" className="w-5" />
            </button>

            {/* Profile Menu */}
            <div className="relative group">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                onClick={() => !token && navigate("/login")}
              >
                <img src={assets.profile_icon} className="w-5" alt="profile" />
              </button>
              
              {token && (
                <div className="absolute right-0 w-48 mt-2 hidden group-hover:block">
                  <div className="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      My Account
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                    </a>
                    <a onClick={() => navigate("/orders")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Orders
                    </a>
                    <a onClick={handleLogout} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer">
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <img src={assets.cart_icon} className="w-5" alt="cart" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 sm:hidden"
              onClick={() => setMenuVisible(true)}
            >
              <img src={assets.menu_icon} className="w-5" alt="menu" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          menuVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuVisible(false)}
      >
        <div
          className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
            menuVisible ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">القائمة</span>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                onClick={() => setMenuVisible(false)}
              >
                <img src={assets.dropdown_icon} alt="close" className="h-4 rotate-180" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm font-medium transition-colors duration-200 border-b
                    ${isActive ? "text-black bg-gray-50" : "text-gray-600 hover:bg-gray-50"}`
                  }
                  onClick={() => setMenuVisible(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;