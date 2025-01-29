import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + "/api/order/verifyMoyasarWebhook",
        { orderId, success, userId: localStorage.getItem("userId") },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

useEffect(() => {
  const verify = async () => {
    try {
      const paymentId = searchParams.get('id'); // Get Moyasar payment ID
      if (!paymentId) return;

      const response = await axios.post(
        `${backendUrl}/api/order/verifyMoyasarWebhook`,
        { id: paymentId }, // Send payment ID to backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Payment verified!");
        setCartItems({});
        navigate('/orders');
      } else {
        toast.error("Payment failed");
        navigate('/cart');
      }
    } catch (error) {
      toast.error("Verification error");
      navigate('/cart');
    }
  };

  verify();
}, []);

  return <div>verify</div>;
};

export default Verify;
