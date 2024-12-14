const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 
const userRoutes = require('./routes/userRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 
const lostItemRoutes = require('./routes/lostItemRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const adminLostItemRoutes = require('./routes/adminLostItemRoutes'); 
const adminClaimRequestRoutes = require('./routes/adminClaimRequestRoutes');
const emailListRoutes = require('./routes/emailListRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/api/users', userRoutes);  
app.use('/api/admins', adminRoutes);  
app.use('/api/lost-items', lostItemRoutes); 
app.use('/api/admin-dashboard', adminDashboardRoutes);
app.use('/api/admin-lost-items', adminLostItemRoutes);
app.use('/api/admin-claim-requests', adminClaimRequestRoutes);
app.use('/api/email-list', emailListRoutes);

// Serve React frontend build
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

// Serve the frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.get('/*', function (req, res) {
  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  )
})

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});