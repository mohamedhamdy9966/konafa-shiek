import MoyasarPayment from "./MoyasarPayment";

const Checkout = ({ cartTotal, orderId }) => {
  const callbackUrl = `${window.location.origin}/verify`;

  return (
    <div className="w-full p-4">
      <h2 className="text-xl mb-4">Complete Payment</h2>
      <MoyasarPayment
        amount={cartTotal}
        description={orderId ? `Order #${orderId}` : "New Order"}
        callbackUrl={callbackUrl}
      />
    </div>
  );
};

export default Checkout;
