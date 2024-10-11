import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material'; // Import Material-UI components

const validationSchema = Yup.object({
  user_name: Yup.string().required('Name is required'),
  user_email: Yup.string().email('Invalid email address').required('Email is required'),
  user_phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  user_password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  retype_password: Yup.string().oneOf([Yup.ref('user_password')], 'Passwords must match').required('Confirm your password'),
  org_name: Yup.string().required('Organization name is required'),
  org_address: Yup.string().required('Organization address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string().matches(/^[0-9]{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
  secure_code: Yup.string().required('Secure code is required'),
});

const Register = () => {
  const formik = useFormik({
    initialValues: {
      user_name: '',
      user_email: '',
      user_phone: '',
      user_password: '',
      retype_password: '',
      org_name: '',
      org_address: '',
      city: '',
      state: '',
      pincode: '',
      secure_code: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', values);
        toast.success('User registered successfully!');
        formik.resetForm(); 
      } catch (error) {
        toast.error('Error registering user: ' + error.response.data.message);
      }
    },
  });

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h5" align="center">Register</Typography>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        <TextField
          label="Your Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="user_name"
          value={formik.values.user_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.user_name && Boolean(formik.errors.user_name)}
          helperText={formik.touched.user_name && formik.errors.user_name}
          required
        />

        <TextField
          label="Your Email"
          variant="outlined"
          fullWidth
          margin="normal"
          name="user_email"
          type="email"
          value={formik.values.user_email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.user_email && Boolean(formik.errors.user_email)}
          helperText={formik.touched.user_email && formik.errors.user_email}
          required
        />

        <TextField
          label="Your Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          name="user_phone"
          value={formik.values.user_phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.user_phone && Boolean(formik.errors.user_phone)}
          helperText={formik.touched.user_phone && formik.errors.user_phone}
          required
        />

        <TextField
          label="Organization Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="org_name"
          value={formik.values.org_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.org_name && Boolean(formik.errors.org_name)}
          helperText={formik.touched.org_name && formik.errors.org_name}
          required
        />

        <TextField
          label="Organization Address"
          variant="outlined"
          fullWidth
          margin="normal"
          name="org_address"
          value={formik.values.org_address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.org_address && Boolean(formik.errors.org_address)}
          helperText={formik.touched.org_address && formik.errors.org_address}
          required
        />

        <TextField
          label="City"
          variant="outlined"
          fullWidth
          margin="normal"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
          required
        />

        <TextField
          label="State"
          variant="outlined"
          fullWidth
          margin="normal"
          name="state"
          value={formik.values.state}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.state && Boolean(formik.errors.state)}
          helperText={formik.touched.state && formik.errors.state}
          required
        />

        <TextField
          label="Postal Code"
          variant="outlined"
          fullWidth
          margin="normal"
          name="pincode"
          value={formik.values.pincode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.pincode && Boolean(formik.errors.pincode)}
          helperText={formik.touched.pincode && formik.errors.pincode}
          required
        />

        <TextField
          label="Secure Code"
          variant="outlined"
          fullWidth
          margin="normal"
          name="secure_code"
          value={formik.values.secure_code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.secure_code && Boolean(formik.errors.secure_code)}
          helperText={formik.touched.secure_code && formik.errors.secure_code}
          required
        />

        <TextField
          label="Your Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="user_password"
          type="password"
          value={formik.values.user_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.user_password && Boolean(formik.errors.user_password)}
          helperText={formik.touched.user_password && formik.errors.user_password}
          required
        />

        <TextField
          label="Retype Your Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="retype_password"
          type="password"
          value={formik.values.retype_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.retype_password && Boolean(formik.errors.retype_password)}
          helperText={formik.touched.retype_password && formik.errors.retype_password}
          required
        />

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
          Register
        </Button>
      </form>

      <Typography align="center" style={{ marginTop: '16px' }}>
        Already a user? <Link to="/login">Login here</Link>
      </Typography>

      <ToastContainer /> 
    </Container>
  );
};

export default Register;
