import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Others'];

const ReportLostItem = () => {
  const [itemName, setItemName] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');

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
    formData.append('lostitem_name', itemName);
    formData.append('lostitem_location', lostLocation);
    formData.append('lostitem_description', itemDescription);
    formData.append('lostitem_category', category);
    formData.append('lostitem_date', date);
    if (image) {
      formData.append('lostitem_image', image);
    }

    try {
      await axios.post('http://localhost:5000/api/lost-items/report-lost-item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Lost item reported successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error reporting lost item';
      toast.error(errorMessage);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: 4 }}>
      <Typography variant="h5" gutterBottom>Report Lost Item</Typography>

      <TextField
        label="Item Name"
        fullWidth
        value={itemName}
        name="lostitem_name"
        onChange={(e) => setItemName(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Lost Location"
        fullWidth
        value={lostLocation}
        name="lostitem_location"
        onChange={(e) => setLostLocation(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Item Description"
        fullWidth
        multiline
        rows={4}
        value={itemDescription}
        name="lostitem_description"
        onChange={(e) => setItemDescription(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Category"
        select
        fullWidth
        value={category}
        name="lostitem_category"
        onChange={(e) => setCategory(e.target.value)}
        margin="normal"
      >
        {categories.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={date}
          name="lostitem_date"
          onChange={(newDate) => setDate(newDate)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

      <TextField
        label="Image"
        fullWidth
        value={imageName}
        name="lostitem_image"
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

      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        Submit
      </Button>

      <ToastContainer />
    </Box>
  );
};

export default ReportLostItem;
