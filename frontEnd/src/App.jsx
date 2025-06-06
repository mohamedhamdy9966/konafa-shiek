import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import DeleteRequest from "./pages/DeleteRequest";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Delivery from "./pages/Delivery";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Collection from "./pages/Collection";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/placeOrder";
import Product from "./pages/Product";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import AdminAdd from "./pages/AdminAdd";
import AdminList from "./pages/AdminList";
import AdminOrders from "./pages/AdminOrders";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import usePullToRefresh from "./context/usePullToRefresh";
import { useNavigate } from "react-router-dom";

const styles = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin 1.2s linear infinite;
}
`;
// eslint-disable-next-line react-refresh/only-export-components
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "SAR";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = () => {
      localStorage.setItem("token", token);
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.isAdmin || false);
        } catch (error) {
          console.error("Error decoding token:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    // Add slight delay for smooth transition
    const timeout = setTimeout(initializeApp, 100);
    return () => clearTimeout(timeout);
  }, [token]);

  // Add axios interceptor in your ShopContext or main App component
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("برجاء تسجيل الدخول أولا  ", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            rtl: true,
          });
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 1000);
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [Navigate]);
  usePullToRefresh();
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <style>{styles}</style>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin-slow"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
                  path="/add"
                  element={
                    // <ProtectedRoute>
                    <AdminAdd token={token} />
                    // </ProtectedRoute>
                  }
                />
                <Route
                  path="/list"
                  element={
                    // <ProtectedRoute>
                    <AdminList token={token} />
                    // </ProtectedRoute>
                  }
                />
                <Route
                  path="/konafaOrders"
                  element={
                    // <ProtectedRoute>
                    <AdminOrders token={token} />
                    // </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/add" />} />
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
            <Route path="/delete" element={<DeleteRequest />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
