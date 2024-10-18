import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <img 
          src="/images/logo.png" 
          alt="Logo" 
          style={{ height: '40px', marginRight: '16px' }} 
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Recoverly
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/admin-login">Admin Login</Button>
        <Button color="inherit" component={Link} to="/admin-register">Admin Register</Button>
        <Button color="inherit" component={Link} to="/user-login">User Login</Button> 
        <Button color="inherit" component={Link} to="/user-register">User Register</Button> 
        <Button color="inherit" component={Link} to="/report-lost-item">Report Lost Item</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
