import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "SAR";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const addToCart = async (itemId, size, sauceSize = 0, selectedSauce = []) => {
    if (!size) {
      toast.error("من فضلك إختر حجم أولا");
      return null;
    }
  
    let cartData = structuredClone(cartItems);
  
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        // If the same size is selected again, toggle the sauce size
        if (cartData[itemId][size].sauceSize === sauceSize) {
          cartData[itemId][size].sauceSize = 0;
          cartData[itemId][size].selectedSauce = [];
        } else {
          cartData[itemId][size] = {
            ...cartData[itemId][size],
            sauceSize,
            selectedSauce: Array.isArray(selectedSauce) ? selectedSauce : [],
          };
        }
      } else {
        cartData[itemId][size] = {
          quantity: 1,
          sauceSize,
          selectedSauce: Array.isArray(selectedSauce) ? selectedSauce : [],
        };
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = {
        quantity: 1,
        sauceSize,
        selectedSauce: Array.isArray(selectedSauce) ? selectedSauce : [],
      };
    }
  
    setCartItems(cartData);
  
    if (token) {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("هذا المشترك غير موجود !");
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
          if (cartItems[items][item].quantity > 0) {
            totalCount += cartItems[items][item].quantity;
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
      toast.error("المنتجات لم يتم تحميلها. برجاء المحاولة في وقت لاحق");
      return;
    }

    let cartData = JSON.parse(JSON.stringify(cartItems));

    if (!cartData[itemId] || !cartData[itemId][size]) {
      toast.error("هذا المنتج لا يوجد في عربة التسوق");
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
          toast.error("هذا المستخدم غير موجود ! من فضلك قم بتسجيل الدخول !");
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
      const itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;

      for (const size in cartItems[items]) {
        const quantity = cartItems[items][size].quantity;
        const sauceSize = cartItems[items][size].sauceSize || 0;

        if (quantity > 0) {
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
        toast.error("هذا المستخدم لم يقم بتسجيل الدخول الان !");
        return;
      }
      const getUserCartResponse = await axios.get(
        backendUrl + `/api/cart/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (getUserCartResponse.data.success) {
        setCartItems(getUserCartResponse.data.cartData || {});
      } else {
        toast.error("فشل في الحصول على بيانات عربة التسوق الخاصة بك");
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
  }, [token]);

  // to fetch cart on token change
  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token]);
const delivery_fee = getCartAmount() > 50 ? 5 : 10;
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
