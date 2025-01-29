import  { useEffect } from "react";

const MoyasarPayment = ({ amount, description, callbackUrl }) => {
  useEffect(() => {
    if (window.Moyasar && amount > 0) {
      try {
        window.Moyasar.init({
          element: '.mysr-form',
          amount: amount * 100,
          currency: 'SAR',
          description: description,
          publishable_api_key: "pk_test_tbt3dDZ1xbpF9ngE3utqMqMTDDfZpPBJ5JVRyJKB",
          callback_url: callbackUrl,
          methods: ['creditcard'],
          onReady: () => console.log('Payment form initialized'),
          onClose: () => console.log('Payment form closed')
        });
      } catch (error) {
        console.error("Moyasar init error:", error);
      }
    }
  }, [amount, description, callbackUrl]);

  return <div className="mysr-form" style={{ width: '100%', maxWidth: '500px' }} />;
};

export default MoyasarPayment;
