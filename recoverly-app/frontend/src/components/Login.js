import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const Login = () => {
  // Formik hook for handling form submission and validation
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/login', values);
        console.log('User logged in successfully:', response.data);
        toast.success('User logged in successfully!');
      } catch (error) {
        console.error('Error logging in user:', error.response.data);
        toast.error('Error logging in user: ' + error.response.data.message);
      }
    },
  });

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center">Login</h2>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        <div className="form-group mb-3">
          <input
            type="email"
            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
            name="email"
            placeholder="Your Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.email && formik.errors.email ? <div className="invalid-feedback">{formik.errors.email}</div> : null}
        </div>
        <div className="form-group mb-3">
          <input
            type="password"
            className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
            name="password"
            placeholder="Your Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.password && formik.errors.password ? <div className="invalid-feedback">{formik.errors.password}</div> : null}
        </div>
        <button type="submit" className="btn btn-primary btn-block">Login</button>
      </form>
      <p className="text-center mt-3">
        Not a user? <Link to="/register">Register</Link>
      </p>
      <ToastContainer /> 
    </div>
  );
};

export default Login;