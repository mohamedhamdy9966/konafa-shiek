import { useEffect } from "react";
import { toast } from "react-toastify";

const MoyasarPayment = ({ amount, description, callbackUrl, onPaymentSuccess }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.moyasar.com/moyasar.js';
    script.async = true;
    script.onload = initializeMoyasar;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeMoyasar = () => {
    window.Moyasar.init({
      element: '.mysr-form',
      amount: amount * 100,
      currency: 'SAR',
      description: description,
      publishable_api_key: process.env.REACT_APP_MOYASAR_PUBLISHABLE_KEY,
      callback_url: callbackUrl,
      methods: ['creditcard'],
      onClose: () => console.log('Payment closed'),
      onReady: () => console.log('Form ready'),
      callback: function (response) {
        if (response.status === 'paid') {
          toast.success('Payment succeeded!');
          onPaymentSuccess();
        } else {
          toast.error('Payment failed!');
        }
      }
    });
  };

  return (
    <div className="mysr-form" style={{ 
      width: '100%', 
      maxWidth: '500px', 
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px'
    }}>
      {/* Moyasar form will be injected here */}
    </div>
  );
};

export default MoyasarPayment;