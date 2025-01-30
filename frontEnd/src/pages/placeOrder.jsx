import { useContext, useState, useEffect } from "react";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("COD");
  const [paymentReady, setPaymentReady] = useState(false);
  const [moyasarConfig, setMoyasarConfig] = useState(null);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    state: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log("Cart Items:", cartItems);
      if (Object.keys(cartItems).length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      let orderItems = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const item = cartItems[productId][size];
          if (item.quantity > 0) {
            const productInfo = products.find(
              (product) => product._id === productId
            );
            if (productInfo) {
              const sizeInfo = productInfo.sizes[size];
              if (sizeInfo) {
                const orderItem = {
                  productId: productInfo._id,
                  name: productInfo.name,
                  image: productInfo.image[0],
                  price: sizeInfo.price + (item.sauceSize || 0),
                  quantity: item.quantity,
                  size: size,
                  sauceSize: item.sauceSize || 0,
                  selectedSauce: item.selectedSauce || [],
                };
                orderItems.push(orderItem);
              } else {
                console.warn(
                  `Size ${size} not found for product ${productInfo.name}`
                );
              }
            }
          }
        }
      }

      console.log("Order Items:", orderItems);

      const userId = localStorage.getItem("userId") || token?.userId || "";
      if (!userId) {
        toast.error("User ID is missing. Please log in.");
        return;
      }

      let orderData = {
        userId,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method,
      };

      console.log("Order Data:", orderData);

      switch (method) {
        case "COD": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case "moyasar": {
          const response = await axios.post(
            backendUrl + "/api/order/moyasar",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) {
            setMoyasarConfig({
              orderId: response.data.orderId,
              amount: orderData.amount,
              callbackUrl: `${window.location.origin}/verify`,
            });
            setPaymentReady(true);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error("Error in onSubmitHandler:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!paymentReady || !moyasarConfig) {
      console.log("Moyasar config not ready:", { paymentReady, moyasarConfig });
      return;
    }

    console.log("Initializing Moyasar Payment Form with:", moyasarConfig);

    if (window.Moyasar) {
      window.Moyasar.init({
        element: ".mysr-form",
        amount: moyasarConfig.amount * 100,
        currency: "SAR",
        description: `Order #${moyasarConfig.orderId}`,
        publishable_api_key: "pk_test_E4j6enesChywd2Po4Phx8UqSWp1cV87JsVXSWxnt",
        callback_url: moyasarConfig.callbackUrl,
        methods: ["creditcard"],
      });
    }
  }, [paymentReady, moyasarConfig]);

  return (
    <form
      autoComplete="true"
      onSubmit={onSubmitHandler}
      className="border-t flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
    >
      {/* leftSide */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"تفاصيل"} text2={"الدفع و الإستلام"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="الإسم الأول"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="الإسم الثاني"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="البريد الإلكتروني"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="العنوان"
        />
        <div className="flex gap-3 flex-col">
          <select
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full cursor-pointer"
          >
            <option disabled className="cursor-pointer">
              {" "}
              إختر فرع التسليم الأقرب إليك
            </option>
            <option className="cursor-pointer"> فرع البساتين</option>
            <option className="cursor-pointer"> فرع الشمال</option>
          </select>
        </div>
        <div className="flex gap-3"></div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="رقم الجوال"
        />
      </div>
      {/* RightSide */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"Payment"} text2={"Method"} />
          {/* Payment Method Selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("COD")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "COD" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                الدفع عند الإستلام
              </p>
            </div>
            <div
              onClick={() => setMethod("moyasar")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "moyasar" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                pay with moyasar
              </p>
            </div>
          </div>
          {/* Moyasar payment form */}
          {paymentReady && (
            <div className="mt-4">
              <div className="mysr-form"></div>
              <p className="text-sm text-gray-500 mt-2">
                سيتم تحويلك إلى صفحة الدفع الآمنة من مویاسر لإتمام عملية الدفع
              </p>
            </div>
          )}
          {/* Checkout button */}
          {!paymentReady && (
            <div className="w-full text-end mt-8">
              <button
                type="submit"
                className="bg-black text-white px-16 py-3 text-sm rounded-sm"
              >
                <h2> checkout </h2>
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
