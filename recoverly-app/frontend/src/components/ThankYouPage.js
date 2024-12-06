import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Redirect to the home page or wherever you'd like
  };

  return (
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
          Thank You for Your Donation!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your support helps us improve the platform for lost and found items.
        </Typography>
    
        <Button variant="contained" color="primary" onClick={handleBackToHome} sx={{ mt: 2 }}>
          Go Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ThankYouPage;
