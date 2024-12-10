import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../api/apiClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button, Typography, Box, Paper } from '@mui/material';

const validationSchema = Yup.object({
  user_email: Yup.string().email('Invalid email').required('Email is required'),
  user_password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const UserLogin = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      user_email: '',
      user_password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await apiClient.post('/users/login', values);
        const { token } = response.data;
        localStorage.setItem('token', token);

        toast.success('User logged in successfully!');
        navigate('/user-homepage');
      } catch (error) {
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
              src="images/User.png"
              alt="User"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '24px', borderRadius: '8px', height: '415px' }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              style={{ color: '#222933', fontWeight: 'bold' }}
            >
              User Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="Email"
                name="user_email"
                value={formik.values.user_email}
                onChange={formik.handleChange}
                error={formik.touched.user_email && Boolean(formik.errors.user_email)}
                helperText={formik.touched.user_email && formik.errors.user_email}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                name="user_password"
                type="password"
                value={formik.values.user_password}
                onChange={formik.handleChange}
                error={formik.touched.user_password && Boolean(formik.errors.user_password)}
                helperText={formik.touched.user_password && formik.errors.user_password}
                fullWidth
                margin="normal"
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
              New User? <Link to="/user-register">Register Here</Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default UserLogin;
