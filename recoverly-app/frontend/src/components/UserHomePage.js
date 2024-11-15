import React from 'react';
import { Container, Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

const UserHomePage = () => {
  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Box
        component="img"
        src="/images/Hero_UserHome_Recoverly.webp" 
        alt="Hero"
        sx={{ width: '100%', height: 'auto', borderRadius: 2, marginBottom: 4 }}
      />

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 4 }}>
        <TextField label="Organization Name" variant="outlined" fullWidth />
        <TextField label="Secure Code" variant="outlined" fullWidth type="password" />
        <Button variant="contained" color="primary">Submit</Button>
      </Box>

      <Typography variant="body1" paragraph>
        Welcome to the user portal. Here, you can access your organization’s requests and monitor the status of each. Use the form above to securely connect to your organization's account.
      </Typography>

      <Paper elevation={2} sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: 'none', fontWeight: 'bold' }}>Requests</TableCell>
              <TableCell sx={{ borderBottom: 'none', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ borderBottom: 'none', fontWeight: 'bold' }}>Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default UserHomePage;
