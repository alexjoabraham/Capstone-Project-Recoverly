import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Container, Grid, TextField, Button, Typography, Box, Paper } from '@mui/material';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const AdminLogin = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/api/admins/login', values);
        console.log('User logged in successfully:', response.data);
        console.log('Admin Login Token:', response.data.token);
        localStorage.setItem('adminToken', response.data.token);

        toast.success('User logged in successfully!');
        window.location.href = '/admin-dashboard';
      } catch (error) {
        console.error('Error logging in user:', error.response?.data || error.message);
        toast.error('Error logging in user: ' + (error.response?.data?.message || 'Server error'));
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Grid container spacing={2} alignItems="center" style={{ height: '80vh' }}>
        <Grid item xs={12} sm={6}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <img
              src="images/Admin.png"
              alt="Admin"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '24px', borderRadius: '8px', height:'415px' }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              style={{ color: '#222933', fontWeight: 'bold' }}
            >
              Admin Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '16px' }}
              >
                Login
              </Button>
            </form>
            <Typography align="center" style={{ marginTop: '16px' }}>
              New Admin? <Link to="/admin-register">Register Here</Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default AdminLogin;
