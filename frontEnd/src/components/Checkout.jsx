import MoyasarPayment from "./MoyasarPayment";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Checkout = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const callbackUrl = `${window.location.origin}/verify`;
  useEffect(() => {
    if (amount > 0 && orderId) setLoading(false);
  }, [amount, orderId]);

  if (loading) return <div className="p-4">Loading payment form...</div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Complete Payment</h1>
      <MoyasarPayment
        amount={amount}
        description={`Order #${orderId}`}
        callbackUrl={callbackUrl}
      />
    </div>
  );
};

export default Checkout;
