import MoyasarPayment from "./MoyasarPayment";

const Checkout = ({ cartTotal, orderId }) => {
  const callbackUrl = `${import.meta.env.VITE_BACKEND_URL}/api/moyasar/callback`;

  return (
    <div>
      <h1>Checkout</h1>
      <MoyasarPayment
        amount={cartTotal}
        description={`Order #${orderId}`}
        callbackUrl={callbackUrl}
      />
    </div>
  );
};

export default Checkout;
