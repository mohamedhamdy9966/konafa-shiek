import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/verifyMoyasarWebhook`,
        { orderId },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        toast.success("Payment verified successfully!");
        setCartItems({});
        navigate('/orders');
      } else {
        toast.error("Payment verification failed");
        navigate('/cart');
      }
    } catch (error) {
      console.error("Verification error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Payment verification error");
      navigate('/cart');
    }
  };

  useEffect(() => {
    if (orderId) verifyPayment();
  }, [orderId]);

  return (
    <div>
      verify
    </div>
  );
};

export default Verify;