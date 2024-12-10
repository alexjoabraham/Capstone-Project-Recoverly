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
  const [showMore, setShowMore] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleLearnMore = () => {
    setShowMore(!showMore);
  };

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
              color: 'black',
              '&:hover': {
                backgroundColor: '#e5decc',
                color: 'black'
              },
            }}
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </TextContainer>
      </BackgroundBox>

      <Dialog open={openModal} onClose={handleCloseModal}>
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

      <Box sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Use Recoverly?
        </Typography>
        <Typography variant="body1" align="center" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Managing lost and found items can be a hassle, but Recoverly makes it simple. Admins of the organizations can easily list found items, send updates to members, and manage claims all in one spot. Members can log in with a secure access code to search and claim their belongings, making it faster and easier for everyone to reconnect with what they’ve lost.
        </Typography>

        <Grid container spacing={4}>
          {[
            { title: 'One-Stop Platform', description: 'A single, easy-to-use platform for managing lost and found items across multiple organizations.' },
            { title: 'Organization-Specific Access', description: 'Users can only view items from their own organization, ensuring privacy and security.' },
            { title: 'Admin-Approved Claims', description: 'Admins review and approve claims, making sure items reach their rightful owners.' },
            { title: 'Collection Deadlines', description: 'Items are available for a limited time, helping keep the system organized and efficient.' },
            { title: 'Photo Uploads', description: 'Photos can be added to item listings to help users quickly identify their belongings.' },
            { title: 'Helpful Analytics', description: 'Admins can see real-time data on lost and found items to keep track of everything.' },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard sx={{
              backgroundColor: '#ca7802',
              color: 'black'
            }}>
                <CardContent>
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography variant="body2">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 6, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Why Choose Recoverly?
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Recoverly offers a simple, secure, and efficient solution for managing lost and found items.
        </Typography>
        {showMore && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
              User-Friendly: Simple navigation and search tools to help you find what you’re looking for.
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
              Secure: Claim approvals and access codes ensure only the right people can collect items.
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
              Efficient: Recoverly offers a single platform and helpful data to manage lost items better.
            </Typography>
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={handleLearnMore}>
          {showMore ? 'Show Less' : 'Show More'}
        </Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Support Recoverly</Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#ca7802', // Same color as the Get Started button
              color: 'black',
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
    </Container>
  );
};

export default HomePage;
