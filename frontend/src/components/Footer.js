import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, position: 'relative', bottom: 0, width: '100%' }}>
      <Typography variant="body1" align="center">
        &copy; {new Date().getFullYear()} Recoverly. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
