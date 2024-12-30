import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "ريال";

  const delivery_fee = 10;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");

  const [showSearch, setShowSearch] = useState(false);

  const [cartItems, setCartItems] = useState({});

  const [products, setProducts] = useState([]);

  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Size");
      return null;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    if (token) {
      try {
        const userId = localStorage.getItem("userId");
        console.log("Retrieved userId:", userId);
        if (!userId) {
          toast.error("User Not exist !");
          return;
        }
        await axios.post(
          backendUrl + "/api/cart",
          { userId, itemId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  
    if (token) {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("User Not Found! Please Log In!");
          return;
        }
        await axios.put(
          backendUrl + "/api/cart", // Note: No `${userId}` in the URL
          { userId, itemId, size, quantity }, // Include userId in the body
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };
  

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      // Find the product details by matching _id
      const itemInfo = products.find((product) => product._id === items);

      // Check if the product exists
      if (!itemInfo) continue;

      for (const size in cartItems[items]) {
        // Add product price multiplied by quantity
        const quantity = cartItems[items][size];
        if (quantity > 0) {
          if (itemInfo.sizes?.[size]?.price) {
            totalAmount += itemInfo.sizes[size].price * quantity;
          } else {
            console.warn(`Size ${size} not found for product ${items}`);
          }
        }
      }
    }

    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      console.log("Backend URL:", backendUrl);
      console.log(response.data);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const userId = localStorage.getItem("userId");
      console.log("Retrieved userId:", userId);
      if (!userId) {
        toast.error("User Not Logged In now !");
        return;
      }
      const getUserCartResponse = await axios.get(
        backendUrl + `/api/cart/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (getUserCartResponse.data.success) {
        setCartItems(getUserCartResponse.data.cartData);
      } else {
        toast.error("Failed to fetch cart data");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    setCartItems,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
