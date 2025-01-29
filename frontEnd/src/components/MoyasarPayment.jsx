import  { useEffect } from "react";

const MoyasarPayment = ({ amount, description, callbackUrl }) => {
  useEffect(() => {
    // Initialize Moyasar payment form
    window.Moyasar?.init({
      element: ".mysr-form",
      amount: amount * 100, // Amount in smallest currency unit
      currency: "SAR",
      description,
      publishable_api_key: "pk_test_E4j6enesChywd2Po4Phx8UqSWp1cV87JsVXSWxnt", 
      callback_url: callbackUrl,
      methods: ["creditcard"], // Add more methods if needed
    });
  }, [amount, description, callbackUrl]);

  return <div className="mysr-form" style={{ width: "360px", margin: "20px auto" }}></div>;
};

export default MoyasarPayment;
