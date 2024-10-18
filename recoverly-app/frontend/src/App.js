import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRegister from './components/AdminRegister';  
import AdminLogin from './components/AdminLogin'; 
import ReportLostItem from './components/ReportLostItem';
import UserRegister from './components/UserRegister';  // Import UserRegister
import UserLogin from './components/UserLogin';  // Import UserLogin
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div className="App">
          <Routes> 
            <Route path="/admin-register" element={<AdminRegister />} /> 
            <Route path="/admin-login" element={<AdminLogin />} /> 
            <Route path="/report-lost-item" element={<ReportLostItem />} />
            <Route path="/user-register" element={<UserRegister />} /> 
            <Route path="/user-login" element={<UserLogin />} /> 
            <Route path="/" element={<AdminRegister />} /> 
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
