import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const [donationAmount, setDonationAmount] = useState(5); // Default amount is $5
  const [donorName, setDonorName] = useState(''); // For donor name
  const [donorEmail, setDonorEmail] = useState(''); // For donor email
  const [emailError, setEmailError] = useState(''); // For email error
  const navigate = useNavigate();

  const handleDonationChange = (event) => {
    setDonationAmount(event.target.value);
  };

  const handleNameChange = (event) => {
    setDonorName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setDonorEmail(event.target.value);
  };

  // Email validation function
  const validateEmail = (email) => {
    // Regular expression for validating email format
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleDonate = () => {
    // Validate donation amount
    if (isNaN(donationAmount) || donationAmount <= 0) {
      alert("Please enter a valid donation amount.");
    } 
    // Validate name and email
    else if (!donorName || !donorEmail) {
      alert("Please enter your name and email.");
    } 
    else if (!validateEmail(donorEmail)) {
      setEmailError("Please enter a valid email address.");
    } 
    else {
      setEmailError(""); // Clear the email error if valid
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": "AUDrgmEcFQJDCsEiPeisH62wffZctSTh9YDvD8e6DzhgcSfEn68nQEAVmn3mn8Ipo3YGTfqbR5zoEL6f" }}>
      <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Center the content of the page */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            flex: 1, // Ensures the content section takes available space
            backgroundColor: '#f5f5f5', // Optional background color
            py: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Support Recoverly with Your Donation
          </Typography>
          <Typography variant="h6" gutterBottom>
            Your contribution helps us improve our platform for lost and found items.
          </Typography>
          
          {/* Donor Name */}
          <TextField
            label="Your Name"
            value={donorName}
            onChange={handleNameChange}
            sx={{ width: 300, mb: 2 }}
          />
          
          {/* Donor Email with error message */}
          <TextField
            label="Your Email"
            type="email"
            value={donorEmail}
            onChange={handleEmailChange}
            sx={{ width: 300, mb: 2 }}
            error={!!emailError}
            helperText={emailError}
          />
          
          {/* Donation Amount */}
          <TextField
            label="Enter Donation Amount"
            type="number"
            value={donationAmount}
            onChange={handleDonationChange}
            sx={{ width: 200, mb: 2 }}
            inputProps={{ min: "1", step: "1" }}
          />
          
          <Button variant="contained" color="primary" onClick={handleDonate} sx={{ mt: 2 }}>
            Confirm Donation Amount
          </Button>

          <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
            {/* PayPal Button */}
            <PayPalButtons
              key={donationAmount} // Force re-render by using donationAmount as the key
              style={{ layout: 'vertical' }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: donationAmount.toString() // Donation amount is dynamic
                    }
                  }]
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  alert(`Donation successful, thank you ${details.payer.name.given_name}!`);
                });
              }}
              onCancel={() => {
                alert('Donation cancelled');
              }}
              onError={(err) => {
                console.error(err);
                alert('Something went wrong with the donation');
              }}
            />
          </Box>
        </Box>
       
      </Container>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
