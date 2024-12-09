import React from 'react';
import { AppBar, Toolbar, Typography, Button, Chip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  const handleLogout = () => {
    if (adminToken) {
      localStorage.removeItem('adminToken');
      navigate('/admin-login');
    } else if (userToken) {
      localStorage.removeItem('token');
      navigate('/user-login');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/">
            <img 
              src="/images/Logo_Recoverly.png" 
              alt="Logo" 
              style={{ height: '40px', marginRight: '16px', cursor: 'pointer' }} 
            />
          </Link>
        </Typography>

        {userToken && (
          <>
            <Chip
              label="User Active"
              color="secondary"
              sx={{ marginRight: '8px' }}
            />
            <Button color="inherit" component={Link} to="/user-homepage">Dashboard</Button>
            <Button color="inherit" component={Link} to="/report-lost-item">Report Lost Item</Button>
            <Button 
              color="error" 
              onClick={handleLogout} 
              sx={{ 
                boxShadow: 3,
                backgroundColor: '#d32f2f',
                padding: '8px 12px',
                color: '#fff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                  transform: 'scale(1.1)',
                },
              }}
            >
              Logout
            </Button>
          </>
        )}

        {adminToken && (
          <>
            <Chip
              label="Admin Active"
              color="secondary"
              sx={{ marginRight: '8px' }}
            />
            <Button color="inherit" component={Link} to="/admin-dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/admin-lost-items">Lost Items</Button>
            <Button color="inherit" component={Link} to="/admin-claim-requests">Claim Requests</Button>
            <Button color="inherit" component={Link} to="/email-list">Email List</Button>
            <Button 
              color="error" 
              onClick={handleLogout} 
              sx={{ 
                boxShadow: 3,
                backgroundColor: '#d32f2f',
                padding: '8px 12px',
                color: '#fff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                  transform: 'scale(1.1)',
                },
              }}
            >
              Logout
            </Button>
          </>
        )}

        {!userToken && !adminToken && (
          <>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/user-login">User</Button>
            <Button color="inherit" component={Link} to="/admin-login">Admin</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
