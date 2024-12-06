import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';

const PaymentPage = () => {
  const [donationAmount, setDonationAmount] = useState(5);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const generatePDFReceipt = () => {
    const doc = new jsPDF();

    // Set font and styles
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text('Recoverly Donation Receipt', 20, 20);

    // Add a line break
    doc.line(20, 25, 190, 25); // Draw a line under the title
    doc.setFontSize(12);
    doc.text(`Thank you for your donation, ${donorName}!`, 20, 40);

    // Donation details
    doc.setFontSize(12);
    doc.text(`Donation Amount: $${donationAmount}`, 20, 55);
    doc.text(`Donor Email: ${donorEmail}`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 75);

    // Additional message
    doc.setFontSize(12);
    doc.text(`Your contribution helps us improve our platform.`, 20, 90);
    doc.text('Recoverly Team', 20, 100);

    // Add a footer or more style
    doc.setFontSize(10);
    doc.text('For any questions, please contact us at support@recoverly.com', 20, 110);

    // Save the PDF
    doc.save('Donation_Receipt.pdf');
  };

  const handleDonate = () => {
    if (isNaN(donationAmount) || donationAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
    } else if (!donorName || !donorEmail) {
      toast.error("Please enter your name and email.");
    } else if (!validateEmail(donorEmail)) {
      setEmailError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
    } else {
      setEmailError("");
      toast.success("Donation amount confirmed. Proceed with PayPal.");
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": "AUDrgmEcFQJDCsEiPeisH62wffZctSTh9YDvD8e6DzhgcSfEn68nQEAVmn3mn8Ipo3YGTfqbR5zoEL6f" }}>
      <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            flex: 1,
            backgroundColor: '#f5f5f5',
            py: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Support Recoverly with Your Donation
          </Typography>
          <Typography variant="h6" gutterBottom>
            Your contribution helps us improve our platform for lost and found items.
          </Typography>
          <TextField
            label="Your Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            sx={{ width: 300, mb: 2 }}
          />
          <TextField
            label="Your Email"
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            sx={{ width: 300, mb: 2 }}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Enter Donation Amount"
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            sx={{ width: 200, mb: 2 }}
            inputProps={{ min: "1", step: "1" }}
          />
          <Button variant="contained" color="primary" onClick={handleDonate} sx={{ mt: 2 }}>
            Confirm Donation Amount
          </Button>

          <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <PayPalButtons
              key={donationAmount}
              style={{ layout: 'vertical' }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: donationAmount.toString() } }]
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  toast.success(`Donation successful, thank you ${details.payer.name.given_name}!`);
                  generatePDFReceipt(); // Generate PDF receipt after successful donation
                  navigate('/thank-you'); // Navigate to a thank-you page
                });
              }}
              onCancel={() => {
                toast.info('Donation cancelled.');
              }}
              onError={(err) => {
                console.error(err);
                toast.error('Something went wrong with the donation process.');
              }}
            />
          </Box>

          {/* Mock Payment Success Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              toast.success("Mock payment successful!");
              generatePDFReceipt(); // Generate PDF receipt
              navigate('/thank-you'); // Navigate to thank-you page
            }}
            sx={{ mt: 4 }}
          >
            Mock Payment Success
          </Button>
        </Box>
        <ToastContainer />
      </Container>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
