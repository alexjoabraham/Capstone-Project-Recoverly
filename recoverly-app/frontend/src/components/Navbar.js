import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/report-lost-item">Report Lost Item</Button>
        <Button color="inherit" component={Link} to="/admin-dashboard">Admin Dashboard</Button>
        <Button color="inherit" component={Link} to="/admin-lost-items">Admin Lost Items</Button>
        <Button color="inherit" component={Link} to="/admin-claim-requests">Admin Claim Requests</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
