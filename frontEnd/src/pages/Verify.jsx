import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('id');
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);

  const verifyPayment = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/verifyMoyasarPayment',
        { paymentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCartItems({});
        navigate('/orders');
      } else {
        navigate('/cart');
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (paymentId) verifyPayment();
  }, [paymentId]);

  return <div>Verifying payment...</div>;
};

export default Verify;