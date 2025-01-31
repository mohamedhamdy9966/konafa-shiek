import { useContext, useState } from "react";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = () => {
  const [method, setMethod] = useState("COD");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    cvc: "",
    month: "",
    year: "",
  });
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };
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

  const checkAuthentication = () => {
    const userId = localStorage.getItem("userId") || token?.userId;
    if (!userId) {
      toast.error("برجاء تسجيل الدخول لإتمام عملية الشراء", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        rtl: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 3500); // Increased to 3500ms to match toast duration
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Check authentication first
      if (!checkAuthentication()) {
        return;
      }

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
          const responseMoyasar = await axios.post(
            backendUrl + "/api/order/moyasar",
            {
              ...orderData,
              paymentSource: {
                type: "creditcard",
                name: cardDetails.name,
                number: cardDetails.number,
                cvc: cardDetails.cvc,
                month: cardDetails.month,
                year: cardDetails.year,
              },
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (responseMoyasar.data.success) {
            window.location.replace(responseMoyasar.data.payment_url);
          } else {
            toast.error(responseMoyasar.data.message);
          }
          break;
        }
        case "applepay": {
          if (
            typeof window === "undefined" ||
            !window.ApplePaySession ||
            !ApplePaySession.canMakePayments()
          ) {
            toast.error("Apple Pay is not available on this device");
            return;
          }

          const orderResponse = await axios.post(
            backendUrl + "/api/order/prepare",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!orderResponse.data.success) {
            toast.error("Failed to create order");
            return;
          }

          const { orderId, amount } = orderResponse.data;

          const paymentRequest = {
            countryCode: "SA",
            currencyCode: "SAR",
            total: {
              label: `Order #${orderId}`,
              amount: amount.toFixed(2),
            },
          };

          const session = new ApplePaySession(3, paymentRequest);

          session.onvalidatemerchant = async (event) => {
            try {
              const validationResponse = await axios.post(
                `${backendUrl}/api/applepay/validate-merchant`,
                {
                  validationURL: event.validationURL,
                  domainName: window.location.hostname,
                }
              );
              session.completeMerchantValidation(validationResponse.data);
            } catch (error) {
              session.abort();
              toast.error("Merchant validation failed");
            }
          };

          session.onpaymentauthorized = async (event) => {
            const paymentToken = event.payment.token;

            try {
              const paymentResponse = await axios.post(
                backendUrl + "/api/order/applepay",
                {
                  orderId,
                  paymentToken: JSON.stringify(paymentToken),
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (paymentResponse.data.success) {
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
                window.location.href = `${origin}/verify?success=true&orderId=${orderId}`;
              } else {
                session.completePayment(ApplePaySession.STATUS_FAILURE);
                toast.error("Payment failed");
              }
            } catch (error) {
              session.completePayment(ApplePaySession.STATUS_FAILURE);
              toast.error(error.message);
            }
          };

          session.begin();
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

  return (
    <form
      autoComplete="true"
      onSubmit={onSubmitHandler}
      className="border-t flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
    >
      {/* Rest of the JSX remains exactly the same */}
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
                الدفع بالبطاقة
              </p>
            </div>
            <div
              onClick={() => setMethod("applepay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "applepay" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Apple Pay
              </p>
            </div>
          </div>
          {method === "moyasar" && (
            <div className="mt-6 p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-3">Enter Card Details</h3>
              <input
                required
                onChange={handleCardChange}
                name="name"
                value={cardDetails.name}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full mb-3"
                type="text"
                placeholder="Cardholder Name"
              />
              <div className="relative mb-3">
                <input
                  required
                  onChange={handleCardChange}
                  name="number"
                  value={cardDetails.number}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full mb-3"
                  type="text"
                  placeholder="Card Number"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <img
                    src={assets.moyasar_cards}
                    className="w-auto h-auto"
                    alt="cards"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  required
                  onChange={handleCardChange}
                  name="cvc"
                  value={cardDetails.cvc}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="CVC"
                />
                <input
                  required
                  onChange={handleCardChange}
                  name="month"
                  value={cardDetails.month}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="MM"
                />
                <input
                  required
                  onChange={handleCardChange}
                  name="year"
                  value={cardDetails.year}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="YYYY"
                />
              </div>
            </div>
          )}
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm rounded-sm"
            >
              <h2> checkout </h2>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </form>
  );
};

export default PlaceOrder;
