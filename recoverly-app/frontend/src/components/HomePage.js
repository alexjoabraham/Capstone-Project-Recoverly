import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const BackgroundBox = styled(Box)({
  backgroundImage: 'url("images/Hero_Recoverly.jpeg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  padding: '100px 0',
  textAlign: 'center',
});

const TextContainer = styled(Box)({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: '20px',
  borderRadius: '8px',
  display: 'inline-block',
});

const FeatureCard = styled(Card)({
  height: '100%',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s, background-color 0.3s, color 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: '#484843',
    color: '#fff',
    boxShadow: '0px 6px 15px rgba(0,0,0,0.3)',
  },
});

const StyledDialogContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  minHeight: '100px',
});

const StyledDialogActions = styled(DialogActions)({
  justifyContent: 'center',
  padding: '20px',
});

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleUserLogin = () => {
    navigate('/user-login');
    setOpenModal(false);
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
    setOpenModal(false);
  };

  const handleDonate = () => {
    navigate('/payment'); // Navigate to PaymentPage for donation
  };

  return (
    <Container maxWidth="xl">
      <BackgroundBox>
        <TextContainer>
          <Typography variant="h2" gutterBottom sx={{ color: '#ffffff' }}>
            Welcome to Recoverly
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your Easy Lost and Found Solution
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
            Recoverly is here to help schools, colleges, gyms, offices, and other places manage lost and found items in one simple, user-friendly space. Whether you’re an admin keeping track of found items or hoping to find what’s been lost, Recoverly is designed to make the process easier, faster, and more secure.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: '#ca7802',
              color: 'white',
              '&:hover': {
                backgroundColor: '#e5decc',
                color: 'black',
              },
            }}
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </TextContainer>
      </BackgroundBox>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle align="center">Select Your Role</DialogTitle>
        <StyledDialogContent>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Continue as a User or Admin.
          </Typography>
          <StyledDialogActions>
            <Button onClick={handleUserLogin} color="primary" variant="contained" sx={{ mx: 2 }}>
              User
            </Button>
            <Button onClick={handleAdminLogin} color="secondary" variant="contained" sx={{ mx: 2 }}>
              Admin
            </Button>
          </StyledDialogActions>
        </StyledDialogContent>
      </Dialog>

      <Box sx={{ py: 6, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Why Choose Recoverly?
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Recoverly offers a simple, secure, and efficient solution for managing lost and found items.
        </Typography>

        <Box sx={{ mt: 4 }}>
  <Typography variant="h4">Support Recoverly</Typography>
  <Button
    variant="contained"
    sx={{
      mt: 2,
      backgroundColor: '#ca7802', // Same color as the Get Started button
      color: 'white',
      '&:hover': {
        backgroundColor: '#e5decc', // Hover effect
        color: 'black',
      },
    }}
    onClick={handleDonate}
  >
    Donate with PayPal
  </Button>
</Box>

      </Box>
    </Container>
  );
};

export default HomePage;
