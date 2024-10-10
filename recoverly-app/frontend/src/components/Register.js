import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

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
    <div className="container mt-5 mb-5">
      <h2 className="text-center">Register</h2>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        <div className="form-group mb-3">
          <input
            type="text"
            className={`form-control ${formik.touched.user_name && formik.errors.user_name ? 'is-invalid' : ''}`}
            name="user_name"
            placeholder="Your Name"
            value={formik.values.user_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.user_name && formik.errors.user_name ? <div className="invalid-feedback">{formik.errors.user_name}</div> : null}
        </div>

        <div className="form-group mb-3">
          <input
            type="email"
            className={`form-control ${formik.touched.user_email && formik.errors.user_email ? 'is-invalid' : ''}`}
            name="user_email"
            placeholder="Your Email"
            value={formik.values.user_email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.user_email && formik.errors.user_email ? <div className="invalid-feedback">{formik.errors.user_email}</div> : null}
        </div>

        <div className="form-group mb-3">
          <input
            type="text"
            className={`form-control ${formik.touched.user_phone && formik.errors.user_phone ? 'is-invalid' : ''}`}
            name="user_phone"
            placeholder="Your Phone Number"
            value={formik.values.user_phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.user_phone && formik.errors.user_phone ? <div className="invalid-feedback">{formik.errors.user_phone}</div> : null}
        </div>

        <div className="form-group mb-3">
          <input
            type="text"
            className={`form-control ${formik.touched.org_name && formik.errors.org_name ? 'is-invalid' : ''}`}
            name="org_name"
            placeholder="Organization Name"
            value={formik.values.org_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.org_name && formik.errors.org_name ? <div className="invalid-feedback">{formik.errors.org_name}</div> : null}
        </div>

        <div className="form-group mb-3">
          <input
            type="text"
            className={`form-control ${formik.touched.org_address && formik.errors.org_address ? 'is-invalid' : ''}`}
            name="org_address"
            placeholder="Organization Address"
            value={formik.values.org_address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.org_address && formik.errors.org_address ? <div className="invalid-feedback">{formik.errors.org_address}</div> : null}
        </div>

        <div className="form-group mb-3">
          <input
            type="text"
            className={`form-control ${formik.touched.city && formik.errors.city ? 'is-invalid' : ''}`}
            name="city"
            placeholder="City"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.city && formik.errors.city ? <div className="invalid-feedback">{formik.errors.city}</div> : null}
        </div>

        <div className="form-group mb-3">
          <input
            type="text"
            className={`form-control ${formik.touched.state && formik.errors.state ? 'is-invalid' : ''}`}
            name="state"
            placeholder="State"
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.state && formik.errors.state ? <div className="invalid-feedback">{formik.errors.state}</div> : null}
        </div>

        <div className="form-group mb-4">
          <input
            type="text"
            className={`form-control ${formik.touched.pincode && formik.errors.pincode ? 'is-invalid' : ''}`}
            name="pincode"
            placeholder="Postal Code"
            value={formik.values.pincode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.pincode && formik.errors.pincode ? <div className="invalid-feedback">{formik.errors.pincode}</div> : null}
        </div>

        <div className="form-group mb-4">
          <input
            type="text"
            className={`form-control ${formik.touched.secure_code && formik.errors.secure_code ? 'is-invalid' : ''}`}
            name="secure_code"
            placeholder="Secure Code"
            value={formik.values.secure_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.secure_code && formik.errors.secure_code ? <div className="invalid-feedback">{formik.errors.secure_code}</div> : null}
        </div>

        <div className="form-group mb-4">
          <input
            type="password"
            className={`form-control ${formik.touched.user_password && formik.errors.user_password ? 'is-invalid' : ''}`}
            name="user_password"
            placeholder="Your Password"
            value={formik.values.user_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.user_password && formik.errors.user_password ? <div className="invalid-feedback">{formik.errors.user_password}</div> : null}
        </div>

        <div className="form-group mb-4">
          <input
            type="password"
            className={`form-control ${formik.touched.retype_password && formik.errors.retype_password ? 'is-invalid' : ''}`}
            name="retype_password"
            placeholder="Retype Your Password"
            value={formik.values.retype_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.retype_password && formik.errors.retype_password ? <div className="invalid-feedback">{formik.errors.retype_password}</div> : null}
        </div>
        
        <button type="submit" className="btn btn-primary btn-block">Register</button>
      </form>

      <div className="text-center mt-4">
        <p>Already a user? <Link to="/login">Login here</Link></p> 
      </div>

      <ToastContainer /> 
    </div>
  );
};

export default Register;