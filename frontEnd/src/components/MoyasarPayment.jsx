import { useEffect } from "react";

const MoyasarPayment = ({ amount, description, callbackUrl }) => {
  useEffect(() => {
    if (window.Moyasar) {
      window.Moyasar.init({
        element: ".mysr-form",
        amount: amount * 100,
        currency: "SAR",
        description: description,
        publishable_api_key: "pk_test_tbt3dDZ1xbpF9ngE3utqMqMTDDfZpPBJ5JVRyJKB",
        callback_url: callbackUrl,
        methods: ["creditcard"],
        onReady: () => console.log("Payment form ready"),
        onClose: () => console.log("Payment form closed"),
        onPaymentCompleted: (payment) => {
          console.log("Payment completed:", payment);
        },
      });
    }
  }, [amount, description, callbackUrl]);

  return (
    <div className="mysr-form" style={{ width: "100%", maxWidth: "500px" }} />
  );
};

export default MoyasarPayment;
