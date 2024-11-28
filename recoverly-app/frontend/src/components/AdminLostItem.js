import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid, CircularProgress, Button } from '@mui/material';

const AdminLostItem = () => {
  const [lostItems, setLostItems] = useState([]);
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
      setError('');
    } catch (error) {
      console.error('Error fetching lost items:', error);
      setError('Failed to fetch lost items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      let update = {};
      if (action === 'found') {
        update = { found_flag: true };
      }
      if (action === 'notFound') {
        update = { found_flag: false };
      }
      await axios.put(`http://localhost:5000/api/admin-lost-items/${id}`, update);
      fetchLostItems();
    } catch (error) {
      console.error(`Error performing action "${action}" on item with ID ${id}:`, error);
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
      <Typography variant="h5" gutterBottom align="center">
        Admin Lost Items List
      </Typography>

      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}

      {lostItems.length === 0 ? (
        <Typography variant="body1" align="center">
          No lost items to display.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {lostItems.map((item) => (
            <Grid item xs={12} sm={4} key={item._id}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction(item._id, 'found')}
                  >
                    Found
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => alert('Notification sent to check')}
                  >
                    Notify to Check
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleAction(item._id, 'notFound')}
                  >
                    Not Found
                  </Button>
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
