import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRegister from './components/AdminRegister';  
import AdminLogin from './components/AdminLogin'; 
import ReportLostItem from './components/ReportLostItem';
import UserRegister from './components/UserRegister';  
import UserLogin from './components/UserLogin';  
import HomePage from './components/HomePage';
import theme from './theme';
import EmailList from './components/EmailList';
import FoundItems from './components/FoundItems';
import PaymentPage from './components/PaymentPage';

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
            {/* <Route path="/" element={<AdminRegister />} />  */}
            <Route path="/" element={<HomePage />} />
            <Route path="/email-list" element={<EmailList />} /> 
            <Route path="/found-items" element={<FoundItems />} /> 
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;