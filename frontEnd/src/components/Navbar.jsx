import { useContext, useState } from "react";
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
  } = useContext(ShopContext);

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/collection", label: "Menu" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="flex items-center justify-between py-5 font-medium relative">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-16 rounded-sm" alt="logo" />
      </Link>

      {/* Main Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${
                isActive ? "text-black" : "text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <p>{label}</p>
                {isActive && (
                  <hr className="w-2/4 border-none h-[1.5px] bg-black" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <img
          src={assets.search_icon}
          alt="search"
          className="w-5 cursor-pointer"
          onClick={() => setShowSearch(true)}
        />

        {/* Profile Icon */}
        <div className="group relative">
          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="profile"
            onClick={() => (token ? null : navigate("/login"))}
          />
          {token && (
            <div className="absolute right-0 hidden group-hover:block pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-black"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5" alt="cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="menu"
          onClick={() => setMenuVisible(true)}
        />
      </div>

      {/* Sidebar for Small Screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white z-50 transition-transform ${
          menuVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          {/* Close Button */}
          <div
            onClick={() => setMenuVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              alt="close"
              className="h-4 rotate-180"
            />
            <p>Back</p>
          </div>

          {/* Sidebar Links */}
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="py-2 pl-6 border"
              onClick={() => setMenuVisible(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
