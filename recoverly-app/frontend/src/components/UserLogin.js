import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../api/apiClient'; // Use centralized Axios setup
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material';

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

        // Save JWT token to local storage
        const { token } = response.data;
        localStorage.setItem('token', token);

        toast.success('User logged in successfully!');
        navigate('/user-homepage'); // Redirect to user homepage
      } catch (error) {
        toast.error('Error logging in user: ' + (error.response?.data?.message || 'Server error'));
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Typography variant="h5">User Login</Typography>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Typography align="center" style={{ marginTop: '16px' }}>
        New User? <Link to="/user-register">Register Here</Link>
      </Typography>
      <ToastContainer />
    </Container>
  );
};

export default UserLogin;
