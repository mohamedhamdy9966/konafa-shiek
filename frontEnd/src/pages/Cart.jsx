import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [animatingItems, setAnimatingItems] = useState(new Set());

  useEffect(() => {
    if (products && products.length > 0) {
      const temporaryData = [];
      const updatedCartItems = { ...cartItems };
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item].quantity > 0) {
            const productExists = products.some(
              (product) => product._id === items
            );
            if (productExists) {
              const productData = products.find((product) => product._id === items);
              temporaryData.push({
                _id: items,
                size: item,
                quantity: cartItems[items][item].quantity,
                sauceSize: cartItems[items][item].sauceSize,
                selectedSauce: cartItems[items][item].selectedSauce || [],
                image: productData.image[0],
              });
            } else {
              if (updatedCartItems[items]) {
                delete updatedCartItems[items][item];
                if (Object.keys(updatedCartItems[items]).length === 0) {
                  delete updatedCartItems[items];
                }
              }
            }
          }
        }
      }
      setCartData(temporaryData);
    }
  }, [cartItems, products]);

  const handleQuantityUpdate = (productId, size, newQuantity, oldQuantity) => {
    // Add animation class
    setAnimatingItems(prev => new Set(prev.add(`${productId}-${size}`)));
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${productId}-${size}`);
        return newSet;
      });
    }, 300);

    const productData = products.find(product => product._id === productId);
    
    if (newQuantity === 0) {
      toast.info('🗑️ تم حذف المنتج من السلة', {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
        theme: "colored"
      });
    } else if (newQuantity > oldQuantity) {
      toast.success(`➕ تم زيادة الكمية إلى ${newQuantity}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
        theme: "colored"
      });
    } else if (newQuantity < oldQuantity) {
      toast.warning(`➖ تم تقليل الكمية إلى ${newQuantity}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
        theme: "colored"
      });
    }
    
    updateQuantity(productId, size, newQuantity);
  };

  if (!products) {
    return (
      <div className="flex items-center justify-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 container mx-auto px-4">
      <div className="text-2xl mb-6">
        <Title text1={"سلة"} text2={"مشترياتك"} />
      </div>
      <div className="space-y-4">
        {cartData && cartData.length > 0 ? (
          cartData.map((itemSelected, index) => {
            const productData = products.find(
              (product) => product._id === itemSelected._id
            );
            if (!productData) {
              console.warn(`Product with ID ${itemSelected._id} not found`);
              return null;
            }

            const itemPrice =
              (productData.sizes?.[itemSelected.size]?.price || 0) +
              (itemSelected.sauceSize || 0);
            const totalPrice = itemPrice * itemSelected.quantity;
            const isAnimating = animatingItems.has(`${itemSelected._id}-${itemSelected.size}`);

            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm p-4 transition-all duration-300 ${
                  isAnimating ? 'scale-105' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      className="w-20 h-20 object-cover rounded-md"
                      src={productData.image[0]}
                      alt={productData.name}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800">
                        {productData.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-gray-600">
                          {currency}
                          {itemPrice.toFixed(2)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                          {itemSelected.size}
                        </span>
                      </div>
                      {itemSelected.sauceSize > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                          حجم الصوص:{" "}
                          {itemSelected.sauceSize === 4
                            ? "XS"
                            : itemSelected.sauceSize === 5
                            ? "S"
                            : itemSelected.sauceSize === 10
                            ? "M"
                            : "L"}
                        </p>
                      )}
                      {itemSelected.selectedSauce && itemSelected.selectedSauce.length > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          أنواع الصوصات: {itemSelected.selectedSauce.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityUpdate(
                            itemSelected._id,
                            itemSelected.size,
                            itemSelected.quantity - 1,
                            itemSelected.quantity
                          )
                        }
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={itemSelected.quantity <= 1}
                      >
                        <MinusCircle size={20} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={itemSelected.quantity}
                        onChange={(e) =>
                          handleQuantityUpdate(
                            itemSelected._id,
                            itemSelected.size,
                            Number(e.target.value),
                            itemSelected.quantity
                          )
                        }
                        className="w-16 text-center border rounded-md py-1"
                      />
                      <button
                        onClick={() =>
                          handleQuantityUpdate(
                            itemSelected._id,
                            itemSelected.size,
                            itemSelected.quantity + 1,
                            itemSelected.quantity
                          )
                        }
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        handleQuantityUpdate(itemSelected._id, itemSelected.size, 0, itemSelected.quantity)
                      }
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="min-w-[100px] text-right">
                      <p className="font-medium text-gray-800">
                        {currency}
                        {totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">السلة فارغة</p>
            <button
              onClick={() => navigate("/")}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              تصفح المنتجات
            </button>
          </div>
        )}
      </div>
      
      {cartData.length > 0 && (
        <div className="flex justify-end my-8">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-end">
              <button
                onClick={() => navigate("/place-order")}
                className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                تأكيد الطلب و الدفع
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;