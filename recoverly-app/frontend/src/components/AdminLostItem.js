import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid, CircularProgress, Button, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLostItem = () => {
  const [lostItems, setLostItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin-lost-items');
      setLostItems(response.data);
      setFilteredItems(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching lost items:', error);
      setError('Failed to fetch lost items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filtered = lostItems.filter((item) =>
      `${item.lostitem_name} ${item.lostitem_location} ${item.lostitem_description} ${item.lostitem_category}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleAction = async (id, action, lostDate) => {
    let update = {};
    let successMessage = '';
    let errorMessage = '';

    switch (action) {
      case 'found':
        update = { found_flag: true };
        successMessage = 'Found status updated successfully';
        errorMessage = 'Error updating found status';
        break;

      case 'notify':
        update = { notify_flag: true };
        successMessage = 'Notify status updated successfully';
        errorMessage = 'Error updating notify status';
        break;

      case 'notFound': {
        const reportedDate = new Date(lostDate);
        const currentDate = new Date();
        const daysPassed = Math.floor((currentDate - reportedDate) / (1000 * 60 * 60 * 24));

        if (daysPassed < 30) {
          toast.error('Item can be updated as not found only after 30 days of the reported lost date');
          return;
        }

        update = { notfound_flag: true };
        successMessage = 'Not Found status updated successfully';
        errorMessage = 'Error updating not found status';
        break;
      }

      default:
        return;
    }

    try {
      await axios.put(`http://localhost:5000/api/admin-lost-items/${id}`, update);

      setLostItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, ...update } : item
        )
      );
      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, ...update } : item
        )
      );

      toast.success(successMessage);
    } catch (error) {
      console.error(`Error performing action "${action}" on item with ID ${id}:`, error);
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4 }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom align="center">
        Admin Lost Items List
      </Typography>

      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}

      <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search Lost Items"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={handleSearch}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {filteredItems.length === 0 ? (
        <Typography variant="body1" align="center">
          No lost items to display.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={4} key={item._id}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: item.found_flag || item.notfound_flag ? 0.5 : 1,
                  pointerEvents: item.found_flag || item.notfound_flag ? 'none' : 'auto',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {item.lostitem_name}
                </Typography>
                <Typography variant="body2">Category: {item.lostitem_category}</Typography>
                <Typography variant="body2">Location: {item.lostitem_location}</Typography>
                <Typography variant="body2">
                  Date: {new Date(item.lostitem_date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Description: {item.lostitem_description}
                </Typography>
                {item.lostitem_image && (
                  <Box
                    component="img"
                    src={item.lostitem_image}
                    alt={item.lostitem_name}
                    sx={{
                      width: 150,
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 1,
                      marginBottom: 2,
                    }}
                  />
                )}
                <Box sx={{ width: '80%', marginTop: 2 }}>
                  <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                      <Button
                        type="button"
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => handleAction(item._id, 'found')}
                      >
                        Found
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={() => handleAction(item._id, 'notify')}
                      >
                        Notify to Check
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="button"
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={() => handleAction(item._id, 'notFound', item.lostitem_date)}
                      >
                        Not Found
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminLostItem;
