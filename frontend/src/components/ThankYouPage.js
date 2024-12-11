import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import jsPDF from 'jspdf';

const ThankYouPage = () => {
  const location = useLocation();
  const { donorName, donorEmail, donationAmount } = location.state || {};

  const generatePDFReceipt = () => {
    const doc = new jsPDF();

    // Load the logo image
    const logoPath = `${process.env.PUBLIC_URL}/images/Logo_Recoverly.png`; 

    const image = new Image();
    image.src = logoPath;

    image.onload = () => {
     // Calculate the aspect ratio and set a fixed height
     const logoHeight = 10; // Fixed height in PDF units
     const aspectRatio = image.width / image.height;
     const logoWidth = logoHeight * aspectRatio; // Width is calculated dynamically

     // Center the logo by adjusting the x position
     const pageWidth = doc.internal.pageSize.width;
     const logoX = (pageWidth - logoWidth) / 2; // Centered x position

     // Add the logo at the top of the PDF
     doc.addImage(image, 'PNG', logoX, 10, logoWidth, logoHeight); // Adjust position
      //doc.addImage(image, 'PNG', 80, 10, 50, 20);
      
      // Set font and styles
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.text('Donation Receipt', 20, 40);

      // Add a line break
      doc.line(20, 45, 190, 45); // Draw a line under the title
      doc.setFontSize(12);
      doc.text(`Thank you for your donation, ${donorName}!`, 20, 60);

      // Donation details
      doc.text(`Donation Amount: $${donationAmount}`, 20, 75);
      doc.text(`Donor Email: ${donorEmail}`, 20, 85);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 95);

      // Footer text at the bottom
      const pageHeight = doc.internal.pageSize.height; // Get the page height
      doc.setFontSize(12);
      doc.text(`Your contribution helps us improve our platform.`, 20, pageHeight - 40);
      doc.text('Recoverly Team', 20, pageHeight - 30);
      doc.setFontSize(10);
      doc.text('For any questions, please contact us at support@recoverly.com', 20, pageHeight - 20);

      // Save the PDF
      doc.save('Donation_Receipt.pdf');
    };
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Thank You for Your Donation!
        </Typography>
        <Typography variant="body1" mb={4}>
          Your support means a lot to us and helps improve our platform.
        </Typography>
        <Button variant="contained" color="primary" onClick={generatePDFReceipt}>
          Download Receipt
        </Button>
      </Box>
    </Container>
  );
};

export default ThankYouPage;
