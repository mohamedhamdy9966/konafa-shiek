import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object({
  firstName: Yup.string().required("الإسم الأول مطلوب"),
  lastName: Yup.string().required("الإسم الثاني مطلوب"),
  email: Yup.string()
    .email("بريد إلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  street: Yup.string().required("العنوان مطلوب"),
  state: Yup.string().required("الفرع مطلوب"),
  phone: Yup.string()
    .matches(/^05\d{8}$/, "رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام")
    .required("رقم الجوال مطلوب"),
  method: Yup.string().required("طريقة الدفع مطلوبة"),
  cardDetails: Yup.object().when("method", {
    is: "moyasar",
    then: () =>
      Yup.object({
        name: Yup.string().required("اسم صاحب البطاقة مطلوب"),
        number: Yup.string()
          .matches(/^\d{16}$/, "رقم البطاقة يجب أن يكون 16 أرقام")
          .required("رقم البطاقة مطلوب"),
        cvc: Yup.string()
          .matches(/^\d{3}$/, "CVC يجب أن يكون 3 أرقام")
          .required("CVC مطلوب"),
        month: Yup.string()
          .matches(/^(0[1-9]|1[0-2])$/, "الشهر غير صالح")
          .required("الشهر مطلوب"),
        year: Yup.string()
          .matches(/^\d{4}$/, "السنة يجب أن تكون 4 أرقام")
          .required("السنة مطلوبة"),
      }).required("تفاصيل البطاقة مطلوبة"),
    otherwise: () => Yup.object().strip(),
  }),
});

const PlaceOrder = () => {
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

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      state: "",
      phone: "",
      method: "COD",
      cardDetails: {
        name: "",
        number: "",
        cvc: "",
        month: "",
        year: "",
      },
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!checkAuthentication()) {
          setSubmitting(false);
          return;
        }

        if (Object.keys(cartItems).length === 0) {
          toast.error("عربة التسوق الخاصة بك فارغة الان ! ");
          setSubmitting(false);
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
                }
              }
            }
          }
        }

        const userId = localStorage.getItem("userId") || token?.userId || "";
        let orderData = {
          userId,
          address: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            street: values.street,
            state: values.state,
            phone: values.phone,
          },
          items: orderItems,
          amount: getCartAmount() + delivery_fee,
          paymentMethod: values.method,
        };

        switch (values.method) {
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
                  ...values.cardDetails,
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
              toast.error(
                "لا يتوفر خاصية الدفع عن طريق أبل باي على هذا الجهاز"
              );
              return;
            }

            const orderResponse = await axios.post(
              backendUrl + "/api/order/prepare",
              orderData,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!orderResponse.data.success) {
              toast.error("حدث فشل أثناء القيام بالطلب !");
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
                  toast.error("لم يتم الدفع");
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
      } finally {
        setSubmitting(false);
      }
    },
  });

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
      }, 1000);
      return false;
    }
    return true;
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="border-t flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"تفاصيل"} text2={"الدفع و الإستلام"} />
        </div>

        <div className="flex gap-3">
          <div className="w-full">
            <input
              name="firstName"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="الإسم الأول"
              {...formik.getFieldProps("firstName")}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-red-500 text-sm rtl">
                {formik.errors.firstName}
              </div>
            )}
          </div>
          <div className="w-full">
            <input
              name="lastName"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="الإسم الثاني"
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-red-500 text-sm rtl">
                {formik.errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div>
          <input
            name="email"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="email"
            placeholder="البريد الإلكتروني"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm rtl">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div>
          <input
            name="street"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="العنوان"
            {...formik.getFieldProps("street")}
          />
          {formik.touched.street && formik.errors.street && (
            <div className="text-red-500 text-sm rtl">
              {formik.errors.street}
            </div>
          )}
        </div>

        <div>
          <select
            name="state"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full cursor-pointer"
            {...formik.getFieldProps("state")}
          >
            <option value="" disabled>
              اختر فرع التسليم الأقرب إليك
            </option>
            <option value="فرع البساتين">فرع البساتين</option>
            <option value="فرع الشمال">فرع الشمال</option>
          </select>
          {formik.touched.state && formik.errors.state && (
            <div className="text-red-500 text-sm rtl">
              {formik.errors.state}
            </div>
          )}
        </div>

        <div>
          <input
            name="phone"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="رقم الجوال"
            {...formik.getFieldProps("phone")}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-sm rtl">
              {formik.errors.phone}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Title text1={"Payment"} text2={"Method"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => formik.setFieldValue("method", "COD")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <div
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  formik.values.method === "COD" ? "bg-green-400" : ""
                }`}
              ></div>
              <p className="text-gray-500 text-sm font-medium mx-4">
                الدفع عند الإستلام
              </p>
            </div>
            <div
              onClick={() => formik.setFieldValue("method", "moyasar")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <div
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  formik.values.method === "moyasar" ? "bg-green-400" : ""
                }`}
              ></div>
              <p className="text-gray-500 text-sm font-medium mx-4">
                pay with card  (متاحة  قريبا )
              </p>
            </div>
            <div
              onClick={() => formik.setFieldValue("method", "applepay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <div
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  formik.values.method === "applepay" ? "bg-green-400" : ""
                }`}
              ></div>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Apple Pay (متاحة  قريبا  )
              </p>
            </div>
          </div>
        </div>

        {formik.values.method === "moyasar" && (
          <div className="mt-6 p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-3">تفاصيل البطاقة</h3>
            <div className="mb-3">
              <input
                name="cardDetails.name"
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="اسم صاحب البطاقة"
                {...formik.getFieldProps("cardDetails.name")}
              />
              {formik.touched.cardDetails?.name &&
                formik.errors.cardDetails?.name && (
                  <div className="text-red-500 text-sm rtl">
                    {formik.errors.cardDetails.name}
                  </div>
                )}
            </div>

            <div className="relative mb-3">
              <input
                name="cardDetails.number"
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="رقم البطاقة"
                {...formik.getFieldProps("cardDetails.number")}
              />
              {formik.touched.cardDetails?.number &&
                formik.errors.cardDetails?.number && (
                  <div className="text-red-500 text-sm rtl">
                    {formik.errors.cardDetails.number}
                  </div>
                )}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <img
                  src={assets.moyasar_cards}
                  className="w-auto h-auto"
                  alt="cards"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-full">
                <input
                  name="cardDetails.cvc"
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="CVC"
                  {...formik.getFieldProps("cardDetails.cvc")}
                />
                {formik.touched.cardDetails?.cvc &&
                  formik.errors.cardDetails?.cvc && (
                    <div className="text-red-500 text-sm rtl">
                      {formik.errors.cardDetails.cvc}
                    </div>
                  )}
              </div>
              <div className="w-full">
                <input
                  name="cardDetails.month"
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="MM"
                  {...formik.getFieldProps("cardDetails.month")}
                />
                {formik.touched.cardDetails?.month &&
                  formik.errors.cardDetails?.month && (
                    <div className="text-red-500 text-sm rtl">
                      {formik.errors.cardDetails.month}
                    </div>
                  )}
              </div>
              <div className="w-full">
                <input
                  name="cardDetails.year"
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="YYYY"
                  {...formik.getFieldProps("cardDetails.year")}
                />
                {formik.touched.cardDetails?.year &&
                  formik.errors.cardDetails?.year && (
                    <div className="text-red-500 text-sm rtl">
                      {formik.errors.cardDetails.year}
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        <div className="w-full text-end mt-8">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-black text-white px-16 py-3 text-sm rounded-sm disabled:opacity-50"
          >
            {formik.isSubmitting ? "جاري المعالجة..." : "إتمام الشراء"}
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
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
