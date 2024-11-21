import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Typography, Grid, InputAdornment, IconButton, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Others'];

const AdminDashboard = () => {
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const fetchFoundItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin-dashboard');
      setFoundItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file ? file.name : '');
  };

  const handleRemoveFile = () => {
    setImage(null);
    setImageName('');
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('founditem_name', itemName);
    formData.append('founditem_location', location);
    formData.append('founditem_description', description);
    formData.append('founditem_category', category);
    formData.append('founditem_date', date);
    if (image) {
      formData.append('founditem_image', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/admin-dashboard', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Found item added successfully!');
      
      setFoundItems(response.data.foundItems);

      setItemName('');
      setLocation('');
      setDescription('');
      setCategory('');
      setDate(null);
      setImage(null);
      setImageName('');
    } catch (error) {
      console.error('Error adding found item:', error);
      const errorMessage = error.response?.data?.message || 'Error adding found item';
      toast.error(errorMessage);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
      <Typography variant="h5" gutterBottom align="center">Add Found Item</Typography>
      <Typography variant="body2" align="center" sx={{ mb: 3 }}>
        Use this form to report found items by entering details such as name, category, location, and date.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            margin="normal"
            sx={{ minHeight: 56 }}
          />
          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
            sx={{ minHeight: 56 }}
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
            sx={{ minHeight: 56 }}
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
            sx={{ minHeight: 56 }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" sx={{ minHeight: 56 }} />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Item
        </Button>
      </Box>

      <ToastContainer />

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>Found Items List</Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
            Below is a list of reported found items.
        </Typography>
        {foundItems.map((item, index) => (
          <Paper
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
              padding: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1">Name: {item.founditem_name}</Typography>
              <Typography variant="subtitle2">Category: {item.founditem_category}</Typography>
              <Typography variant="body2">Location: {item.founditem_location}</Typography>
              <Typography variant="body2">Date: {item.founditem_date ? new Date(item.founditem_date).toLocaleDateString() : ''}</Typography>
              <Typography variant="body2">Description: {item.founditem_description}</Typography>
            </Box>
            {item.founditem_image && (
              <Box
                component="img"
                src={item.founditem_image}
                alt={item.founditem_name}
                sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
              />
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
