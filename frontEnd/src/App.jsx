import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Collection from "./pages/Collection";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/placeOrder";
import Product from "./pages/Product";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import AdminAdd from "./pages/AdminAdd";
import AdminList from "./pages/AdminList";
import AdminOrders from "./pages/AdminOrders";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import jwtDecode from "jwt-decode";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "SAR";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // Decode the token to check if the user is an admin
  let isAdmin = false;
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Use jwt-decode here
      isAdmin = decodedToken.isAdmin || false;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px[9vw]">
      <ToastContainer />
      {isAdmin ? (
        // Admin Panel Layout
        <>
          <AdminNavbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <AdminSidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route
                  path="/admin/add"
                  element={
                    <ProtectedRoute>
                      <AdminAdd token={token} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/list"
                  element={
                    <ProtectedRoute>
                      <AdminList token={token} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute>
                      <AdminOrders token={token} />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        // User-Facing Layout
        <>
          <Navbar />
          <SearchBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
