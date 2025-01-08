import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

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
                image: productData.image[0], // Include the image URL
              });
            } else {
              // Remove items that are no longer available
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

  // Show loading message if products are not yet loaded
  if (!products) {
    return <div className="text-center mt-10">Loading cart...</div>;
  }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"سلة"} text2={"مشترياتك"} />
      </div>
      <div>
        {cartData && cartData.length > 0 ? (
          cartData.map((itemSelected, index) => {
            const productData = products.find(
              (product) => product._id === itemSelected._id
            );
            // Skip if the product is not found
            if (!productData) {
              console.warn(`Product with ID ${itemSelected._id} not found`);
              return null;
            }

            // Calculate the total price for this item
            const itemPrice =
              (productData.sizes?.[itemSelected.size]?.price || 0) +
              (itemSelected.sauceSize || 0);
            const totalPrice = itemPrice * itemSelected.quantity;

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    className="w-16 sm:w-20"
                    src={productData.image[0]}
                    alt="image"
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {itemPrice.toFixed(2)}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                        {itemSelected.size}
                      </p>
                    </div>
                    {itemSelected.sauceSize > 0 && (
                      <p className="mt-2">
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
                      <p className="mt-2">
                        أنواع الصوصات: {itemSelected.selectedSauce.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(
                          itemSelected._id,
                          itemSelected.size,
                          Number(e.target.value)
                        )
                  }
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  defaultValue={itemSelected.quantity}
                />
                <img
                  onClick={() =>
                    updateQuantity(itemSelected._id, itemSelected.size, 0)
                  }
                  src={assets.bin_icon}
                  alt="binIcon"
                  className="w-4 mr-4 sm:mr-5 cursor-pointer"
                />
                <p className="text-sm font-medium">
                  الإجمالي: {currency}
                  {totalPrice.toFixed(2)}
                </p>
              </div>
            );
          })
        ) : (
          <div>برجاء إضافة المنتجات التي ترغب بها</div>
        )}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              تأكيد الطلب و الدفع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;