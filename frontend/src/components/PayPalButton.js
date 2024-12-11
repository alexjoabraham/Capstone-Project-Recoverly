import React, { useEffect, useRef } from 'react';

const PayPalButton = ({ amount }) => {
  const paypalRef = useRef();

  useEffect(() => {
    // Initialize the PayPal button when the component mounts or amount changes
    const paypalButtons = window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount, // Dynamic donation amount
              },
              // Optional: You can add other order details here
            },
          ],
          // Optional: Set `intent` to "CAPTURE" to process payment immediately
          intent: 'CAPTURE',
        });
      },
      onApprove: async (data, actions) => {
        try {
          const order = await actions.order.capture();
          console.log('Order successfully completed:', order);
          alert('Thank you for your donation!');
        } catch (err) {
          console.error('PayPal approval error:', err);
          alert('An error occurred while processing your donation');
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        alert('An error occurred with PayPal');
      },
      // Customize PayPal button's flow and appearance
      style: {
        layout: 'vertical',
        shape: 'rect',
        label: 'donate',
      },
      // Disable shipping address collection
      fundingSource: window.paypal.FUNDING.PAYPAL,
    });

    // Render the PayPal button inside the ref element
    paypalButtons.render(paypalRef.current);

    // Cleanup on unmount
    return () => {
      paypalButtons.close();
    };
  }, [amount]); // Re-run the effect when the donation amount changes

  return <div ref={paypalRef} />;
};

export default PayPalButton;
