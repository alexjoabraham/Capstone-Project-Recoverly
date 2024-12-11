import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Checkbox, FormControlLabel, Box } from '@mui/material';

function FoundItems() {
  const [item, setItem] = useState({
    name: "",
    location: "",
    description: "",
    date: "",
    category: "",
    image: ""
  });
  const [sendEmail, setSendEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sendEmail) {
      alert("Notifications sent to email list.");
    }
    alert("Item has been added to Found Items list.");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box sx={{ bgcolor: '#f9f9f9', p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Report Found Item
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Item Name"
            name="name"
            variant="outlined"
            value={item.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location Found"
            name="location"
            variant="outlined"
            value={item.location}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            variant="outlined"
            value={item.description}
            onChange={handleChange}
            required
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Date Found"
            name="date"
            type="date"
            variant="outlined"
            value={item.date}
            onChange={handleChange}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            variant="outlined"
            value={item.category}
            onChange={handleChange}
            required
            margin="normal"
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              name="image"
              hidden
              onChange={(e) => setItem({ ...item, image: e.target.files[0] })}
            />
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                checked={sendEmail}
                onChange={() => setSendEmail(!sendEmail)}
                color="primary"
              />
            }
            label="Send notification to email list"
            sx={{ mt: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Add Found Item
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default FoundItems;
