const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log('Middleware Token:', token);
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Admin ID:', decoded.id); 
      req.admin = await Admin.findById(decoded.id);
      if (!req.admin) return res.status(404).json({ message: 'Admin not found' });
      req.adminId = decoded.id; 
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      res.status(400).json({ message: 'Invalid token.' });
    }
  };

module.exports = authenticateAdmin;
