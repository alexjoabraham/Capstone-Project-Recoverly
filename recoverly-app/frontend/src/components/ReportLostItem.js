import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: 4 }}>
      <Typography variant="h5" gutterBottom>Report Lost Item</Typography>

      <TextField
        label="Item Name"
        fullWidth
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Lost Location"
        fullWidth
        value={lostLocation}
        onChange={(e) => setLostLocation(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Item Description"
        fullWidth
        multiline
        rows={4}
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        margin="normal"
      />

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

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

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

      <Button variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </Box>
  );
};

export default ReportLostItem;