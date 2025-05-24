import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({ deliveryOption, setDeliveryOption }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"سلة"} text2={"مشترياتك"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <p>الحساب</p>
          <p>
            {currency}
            {getCartAmount()}.00
          </p>
        </div>
        <hr />

        {/* Shipping Fee */}
        <div className="flex justify-between">
          <section>
            <p>مصاريف الشحن </p>
            <p className="text-xs text-orange-950">
              للطلبات فوق خمسون ريال خمسة ريال فقط
            </p>
            <div className="mt-2 space-y-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="branch"
                  checked={deliveryOption === "branch"}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                />
                <span>من الفرع</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryOption === "delivery"}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                />
                <span>توصيل </span>
              </label>
            </div>
          </section>
          <section>
            {deliveryOption === "delivery" ? (
              <span>
                {currency} {delivery_fee}
              </span>
            ) : (
              <span>{currency} 0</span>
            )}
          </section>
        </div>
        <hr />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <b>إجمالي الحساب</b>
          <p>
            {currency}{" "}
            {getCartAmount() === 0
              ? 0
              : getCartAmount() +
                (deliveryOption === "delivery" ? delivery_fee : 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
