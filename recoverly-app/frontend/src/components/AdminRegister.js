import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material';

const validationSchema = Yup.object({
  admin_name: Yup.string().required('Admin Name is required'),
  admin_email: Yup.string().email('Invalid email address').required('Email is required'),
  admin_phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  admin_password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  retype_password: Yup.string().oneOf([Yup.ref('admin_password')], 'Passwords must match').required('Confirm your password'),
  organization_name: Yup.string().required('Organization name is required'),
  organization_address: Yup.string().required('Organization address is required'),
  organization_securecode: Yup.string().required('Secure code is required'),
});

const AdminRegister = () => {
  const formik = useFormik({
    initialValues: {
      admin_name: '',
      admin_email: '', 
      admin_phone: '',
      admin_password: '',
      retype_password: '',
      organization_name: '',
      organization_address: '',
      organization_securecode: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/api/admins/register', values);
        toast.success('Admin registered successfully!');
        formik.resetForm(); 
      } catch (error) {
        toast.error('Error registering admin: ' + error.response.data.message);
      }
    },
  });

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h5" align="center">Admin Registration</Typography>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        <TextField
          label="Admin Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="admin_name"
          value={formik.values.admin_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.admin_name && Boolean(formik.errors.admin_name)}
          helperText={formik.touched.admin_name && formik.errors.admin_name}
          required
        />

        <TextField
          label="Admin Email" 
          variant="outlined"
          fullWidth
          margin="normal"
          name="admin_email"
          type="email"
          value={formik.values.admin_email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.admin_email && Boolean(formik.errors.admin_email)}
          helperText={formik.touched.admin_email && formik.errors.admin_email}
          required
        />

        <TextField
          label="Admin Phone"
          variant="outlined"
          fullWidth
          margin="normal"
          name="admin_phone"
          value={formik.values.admin_phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.admin_phone && Boolean(formik.errors.admin_phone)}
          helperText={formik.touched.admin_phone && formik.errors.admin_phone}
          required
        />

        <TextField
          label="Organization Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="organization_name"
          value={formik.values.organization_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.organization_name && Boolean(formik.errors.organization_name)}
          helperText={formik.touched.organization_name && formik.errors.organization_name}
          required
        />

        <TextField
          label="Organization Address"
          variant="outlined"
          fullWidth
          margin="normal"
          name="organization_address"
          value={formik.values.organization_address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.organization_address && Boolean(formik.errors.organization_address)}
          helperText={formik.touched.organization_address && formik.errors.organization_address}
          required
        />

        <TextField
          label="Organization Secure Code"
          variant="outlined"
          fullWidth
          margin="normal"
          name="organization_securecode"
          value={formik.values.organization_securecode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.organization_securecode && Boolean(formik.errors.organization_securecode)}
          helperText={formik.touched.organization_securecode && formik.errors.organization_securecode}
          required
        />

        <TextField
          label="Admin Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="admin_password"
          type="password"
          value={formik.values.admin_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.admin_password && Boolean(formik.errors.admin_password)}
          helperText={formik.touched.admin_password && formik.errors.admin_password}
          required
        />

        <TextField
          label="Retype Password"
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
        Already registered? <Link to="/admin-login">Login Here</Link>
      </Typography>

      <ToastContainer />
    </Container>
  );
};

export default AdminRegister;