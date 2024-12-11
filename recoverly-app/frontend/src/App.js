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
import UserHomePage from './components/UserHomePage';
import HomePage from './components/HomePage';
import AdminDashboard from './components/AdminDashboard';
import AdminLostItem from './components/AdminLostItem';
import AdminClaimRequest from './components/AdminClaimRequest';
import ClaimItemsPage from './components/ClaimItemsPage';
import UserClaimRequest from './components/UserClaimRequest';
import theme from './theme';
import EmailListPage from './components/EmailListPage';
import FoundItems from './components/FoundItems';
import PaymentPage from './components/PaymentPage';
import ThankYouPage from './components/ThankYouPage';

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
            <Route path="/user-homepage" element={<UserHomePage />} />
            <Route path="/claim-items" element={<ClaimItemsPage />} />
            <Route path="/claim-request/:id" element={<UserClaimRequest />} />
            {/* <Route path="/" element={<AdminRegister />} />  */}
            <Route path="/" element={<HomePage />} />
            <Route path="/email-list" element={<EmailListPage />} /> 
            <Route path="/found-items" element={<FoundItems />} /> 
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-lost-items" element={<AdminLostItem />} />
            <Route path="/admin-claim-requests" element={<AdminClaimRequest />} />
            <Route path="/email-list" element={<EmailListPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;