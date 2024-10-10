import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; 

const Register = () => {
  const [formData, setFormData] = useState({
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
  });

  const { 
    user_name, 
    user_email, 
    user_phone, 
    user_password, 
    retype_password, 
    org_name, 
    org_address, 
    city, 
    state, 
    pincode, 
    secure_code 
  } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user_password !== retype_password) {
      toast.error('Passwords do not match!'); 
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      console.log('User registered successfully:', response.data);
      toast.success('User registered successfully!'); 
      setFormData({
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
      });
    } catch (error) {
      console.error('Error registering user:', error.response.data);
      toast.error('Error registering user: ' + error.response.data.message);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center">Register</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group mb-3">
          <input type="text" className="form-control" name="user_name" value={user_name} onChange={handleChange} placeholder="Your Name" required />
        </div>
        <div className="form-group mb-3">
          <input type="email" className="form-control" name="user_email" value={user_email} onChange={handleChange} placeholder="Your Email" required />
        </div>
        <div className="form-group mb-3">
          <input type="text" className="form-control" name="user_phone" value={user_phone} onChange={handleChange} placeholder="Your Phone Number" required />
        </div>
        <div className="form-group mb-3">
          <input type="text" className="form-control" name="org_name" value={org_name} onChange={handleChange} placeholder="Organization Name" required />
        </div>
        <div className="form-group mb-3">
          <input type="text" className="form-control" name="org_address" value={org_address} onChange={handleChange} placeholder="Organization Address" required />
        </div>
        <div className="form-group mb-3">
          <input type="text" className="form-control" name="city" value={city} onChange={handleChange} placeholder="City" required />
        </div>
        <div className="form-group mb-3">
          <input type="text" className="form-control" name="state" value={state} onChange={handleChange} placeholder="State" required />
        </div>
        <div className="form-group mb-4">
          <input type="text" className="form-control" name="pincode" value={pincode} onChange={handleChange} placeholder="Postal Code" required />
        </div>
        <div className="form-group mb-4">
          <input type="text" className="form-control" name="secure_code" value={secure_code} onChange={handleChange} placeholder="Secure Code" required /> {/* New field for secure code */}
        </div>
        <div className="form-group mb-4">
          <input type="password" className="form-control" name="user_password" value={user_password} onChange={handleChange} placeholder="Your Password" required />
        </div>
        <div className="form-group mb-4">
          <input type="password" className="form-control" name="retype_password" value={retype_password} onChange={handleChange} placeholder="Retype Your Password" required />
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
