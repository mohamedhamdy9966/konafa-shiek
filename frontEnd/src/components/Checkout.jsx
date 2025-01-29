import MoyasarPayment from "./MoyasarPayment";

const Checkout = ({ cartTotal, orderId }) => {
  const callbackUrl = `${window.location.origin}/verify`;

  return (
    <div className="w-full">
      <MoyasarPayment
        amount={cartTotal}
        description={`Order #${orderId}`}
        callbackUrl={callbackUrl}
      />
    </div>
  );
};

export default Checkout;
