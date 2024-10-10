import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; // Import Link

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log('User logged in successfully:', response.data);
      toast.success('User logged in successfully!');
    } catch (error) {
      console.error('Error logging in user:', error.response.data);
      toast.error('Error logging in user: ' + error.response.data.message);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group mb-3">
          <input 
            type="email" 
            className="form-control" 
            name="email" 
            value={email} 
            onChange={handleChange} 
            placeholder="Your Email" 
            required 
          />
        </div>
        <div className="form-group mb-3">
          <input 
            type="password" 
            className="form-control" 
            name="password" 
            value={password} 
            onChange={handleChange} 
            placeholder="Your Password" 
            required 
          />
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
