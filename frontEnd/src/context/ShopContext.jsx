import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "SAR";

  const delivery_fee = 0;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");

  const [showSearch, setShowSearch] = useState(false);

  const [cartItems, setCartItems] = useState({});

  const [products, setProducts] = useState([]);

  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const addToCart = async (itemId, size, sauceSize = 0, selectedSauce = []) => {
    if (!size) {
      toast.error("Please Select Size");
      return null;
    }
  
    let cartData = structuredClone(cartItems);
  
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] = {
          ...cartData[itemId][size],
          quantity: (cartData[itemId][size].quantity || 0) + 1,
          sauceSize,
          selectedSauce: Array.isArray(selectedSauce) ? selectedSauce : [], // Ensure selectedSauce is an array
        };
      } else {
        cartData[itemId][size] = {
          quantity: 1,
          sauceSize,
          selectedSauce: Array.isArray(selectedSauce) ? selectedSauce : [], // Ensure selectedSauce is an array
        };
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = {
        quantity: 1,
        sauceSize,
        selectedSauce: Array.isArray(selectedSauce) ? selectedSauce : [], // Ensure selectedSauce is an array
      };
    }
  
    setCartItems(cartData);
  
    if (token) {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("User Not exist !");
          return;
        }
        await axios.post(
          backendUrl + "/api/cart",
          { userId, itemId, size, sauceSize, selectedSauce },
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
          // Check if the quantity is greater than 0
          if (cartItems[items][item].quantity > 0) {
            totalCount += cartItems[items][item].quantity; // Add the quantity to the total count
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (!products) {
      toast.error("Products are not yet loaded. Please try again.");
      return;
    }

    let cartData = JSON.parse(JSON.stringify(cartItems));

    if (!cartData[itemId] || !cartData[itemId][size]) {
      toast.error("Item not found in cart");
      return;
    }

    cartData[itemId][size] = {
      ...cartData[itemId][size],
      quantity: quantity,
    };

    setCartItems(cartData);

    if (token) {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("User Not Found! Please Log In!");
          return;
        }
        await axios.put(
          backendUrl + "/api/cart",
          { userId, itemId, size, quantity },
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
        const quantity = cartItems[items][size].quantity;
        const sauceSize = cartItems[items][size].sauceSize || 0;

        if (quantity > 0) {
          // Check if the size and price exist for the product
          if (itemInfo.sizes && itemInfo.sizes[size]?.price) {
            totalAmount += (itemInfo.sizes[size].price + sauceSize) * quantity;
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
      if (!userId) {
        toast.error("User Not Logged In now !");
        return;
      }
      const getUserCartResponse = await axios.get(
        backendUrl + `/api/cart/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (getUserCartResponse.data.success) {
        setCartItems(getUserCartResponse.data.cartData || {}); // Ensure cartData is an object
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

  // useEffect(() => {
  //   if (!token && localStorage.getItem("token")) {
  //     setToken(localStorage.getItem("token"));
  //     getUserCart(localStorage.getItem("token"));
  //   }
  // }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
      getUserCart(storedToken); // Load the cart as soon as the token is available
    }
  }, [token]);
  

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
