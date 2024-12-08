import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [menuAnchor, setMenuAnchor] = useState(null);

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

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const renderDesktopNav = () => (
    <>
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
    </>
  );

  const renderMobileNav = () => (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {userToken && (
          <>
            <MenuItem onClick={handleMenuClose} component={Link} to="/user-homepage">
              Dashboard
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/report-lost-item">
              Report Lost Item
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
            >
              Logout
            </MenuItem>
          </>
        )}
        {adminToken && (
          <>
            <MenuItem onClick={handleMenuClose} component={Link} to="/admin-dashboard">
              Dashboard
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/admin-lost-items">
              Lost Items
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/admin-claim-requests">
              Claim Requests
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
            >
              Logout
            </MenuItem>
          </>
        )}
        {!userToken && !adminToken && (
          <>
            <MenuItem onClick={handleMenuClose} component={Link} to="/">
              Home
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/user-login">
              User
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/admin-login">
              Admin
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );

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
        {isMobile ? renderMobileNav() : renderDesktopNav()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
