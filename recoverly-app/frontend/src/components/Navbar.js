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
        <Button color="inherit" component={Link} to="/login">Login</Button>
        <Button color="inherit" component={Link} to="/register">Register</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
