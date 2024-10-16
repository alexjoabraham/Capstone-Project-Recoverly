import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, TextField, Button, Typography } from '@mui/material';

const validationSchema = Yup.object({
  user_name: Yup.string().required('Name is required'),
  user_email: Yup.string().email('Invalid email').required('Email is required'),
  user_phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  user_password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('user_password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const UserRegister = () => {
  const formik = useFormik({
    initialValues: {
      user_name: '',
      user_email: '',
      user_phone: '',
      user_password: '',
      confirm_password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', values);
        toast.success('User registered successfully!');
      } catch (error) {
        toast.error('Error registering user: ' + error.response.data.message);
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Typography variant="h5">Register</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Name"
          name="user_name"
          value={formik.values.user_name}
          onChange={formik.handleChange}
          error={formik.touched.user_name && Boolean(formik.errors.user_name)}
          helperText={formik.touched.user_name && formik.errors.user_name}
          fullWidth
          margin="normal"
        />
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
          label="Phone"
          name="user_phone"
          value={formik.values.user_phone}
          onChange={formik.handleChange}
          error={formik.touched.user_phone && Boolean(formik.errors.user_phone)}
          helperText={formik.touched.user_phone && formik.errors.user_phone}
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
        <TextField
          label="Retype Password"
          name="confirm_password"
          type="password"
          value={formik.values.confirm_password}
          onChange={formik.handleChange}
          error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
          helperText={formik.touched.confirm_password && formik.errors.confirm_password}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default UserRegister;
