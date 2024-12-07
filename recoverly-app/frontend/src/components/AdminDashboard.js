import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Typography, Grid, InputAdornment, IconButton, Paper } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/apiClient';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const categories = ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Others'];

const AdminDashboard = () => {
  const [adminId, setAdminId] = useState(null);
  const [token, setToken] = useState(null); 
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [foundItems, setFoundItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('Retrieved token:', token);
    if (token) {
      setToken(token);
      const decoded = jwtDecode(token);
      console.log('Decoded Admin ID:', decoded?.id);
      setAdminId(decoded?.id);
      fetchFoundItems(decoded.id);
    }
  }, []);

  const fetchFoundItems = async (adminId) => {
    try {
      const token = localStorage.getItem('adminToken'); 
      const response = await axios.get('http://localhost:5000/api/admin-dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
        params: { adminId },  
      });
      setFoundItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file ? file.name : '');
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

  const handleRemoveFile = () => {
    setImage(null);
    setImageName('');
    setImagePreview('');
  };

  const handleSubmit = async () => {
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,  
    };
    const formData = new FormData();
    formData.append('founditem_name', itemName);
    formData.append('founditem_location', location);
    formData.append('founditem_description', description);
    formData.append('founditem_category', category);
    formData.append('founditem_date', date);
    console.log('Admin ID before submitting:', adminId);
    formData.append('adminId', adminId); 
    if (image) {
      formData.append('founditem_image', image);
    }
    console.log('Submitting Form Data:', formData);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      if (editMode) {
        console.log(`Editing Found Item with ID: ${editItemId}`);
        const response = await apiClient.put(
          `http://localhost:5000/api/admin-dashboard/${editItemId}`,
          formData, { headers });
        console.log('Server Response (Edit):', response.data);
        toast.success('Found item updated successfully!');
      } else {
        const response = await apiClient.post(
          'http://localhost:5000/api/admin-dashboard',
          formData,
          formData, { headers });
        console.log('Server Response (Add):', response.data);
        toast.success('Found item added successfully!');
      }

      fetchFoundItems(adminId);
      resetForm();
    } catch (error) {
      console.error('Error saving found item:', error);
      const errorMessage = error.response?.data?.message || 'Error saving found item';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (item) => {
    setItemName(item.founditem_name);
    setLocation(item.founditem_location);
    setDescription(item.founditem_description);
    setCategory(item.founditem_category);
    setDate(new Date(item.founditem_date));
    setImage(null);
    setImagePreview(item.founditem_image);
    setImageName('');
    setEditMode(true);
    setEditItemId(item._id);
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setItemName('');
    setLocation('');
    setDescription('');
    setCategory('');
    setDate(null);
    setImage(null);
    setImageName('');
    setImagePreview('');
    setEditMode(false);
    setEditItemId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin-dashboard/${id}`);
      toast.success('Found item deleted successfully!');
      fetchFoundItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Error deleting item');
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filtered = foundItems.filter((item) =>
      `${item.founditem_name} ${item.founditem_location} ${item.founditem_description} ${item.founditem_category}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); 
    toast.info('Logged out successfully.');
    setTimeout(() => {
      window.location.href = '/admin-login'; 
    }, 1000);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Admin Dashboard</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom align="center">
        {editMode ? 'Edit Found Item' : 'Add Found Item'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Category"
            select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Image"
            fullWidth
            value={imageName}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <Button variant="contained" component="label">
                      Choose File
                      <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                  </InputAdornment>
                  {image && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleRemoveFile}>
                        <DeleteIcon />
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              ),
            }}
            margin="normal"
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              style="width:360px;margin-top:15px"
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {editMode ? 'Update Item' : 'Add Item'}
        </Button>
        {editMode && (
          <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>
            Cancel
          </Button>
        )}
      </Box>

      <ToastContainer />

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Found Items List
        </Typography>

        <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'center' }}>
          <TextField
            label="Search Found Items"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={handleSearch}
            sx={{ maxWidth: 500 }}
          />
        </Box>

        {filteredItems.map((item) => (
          <Paper
            key={item._id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
              padding: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={item.founditem_image ? item.founditem_image : 'https://placehold.co/100?text=No+Image'}
              alt={item.founditem_name || 'Placeholder'}
              sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1, marginRight: 2 }}
            />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1">Name: {item.founditem_name}</Typography>
                <Typography variant="subtitle2">Category: {item.founditem_category}</Typography>
                <Typography variant="body2">Location: {item.founditem_location}</Typography>
                <Typography variant="body2">Date: {new Date(item.founditem_date).toLocaleDateString()}</Typography>
                <Typography variant="body2">Description: {item.founditem_description}</Typography>
              </Box>
            </Box>
            <Box>
              <IconButton onClick={() => handleEdit(item)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(item._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
