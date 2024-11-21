const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 
const userRoutes = require('./routes/userRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 
const lostItemRoutes = require('./routes/lostItemRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes'); 

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

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
