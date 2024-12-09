import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper, Button, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminClaimRequest = () => {
  const [claimRequests, setClaimRequests] = useState([]);
  const [rejectReason, setRejectReason] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaimRequests();
  }, []);

  const fetchClaimRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin-claim-requests');
      setClaimRequests(response.data);
    } catch (error) {
      console.error('Error fetching claim requests:', error);
      toast.error('Failed to fetch claim requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin-claim-requests/${id}/approve`);
      toast.success('Claim approved successfully');
      updateRequestState(id, { claimapproved: true });
    } catch (error) {
      console.error('Error approving claim:', error);
      console.log('Error Response:', error.response?.data);
      toast.error('Failed to approve claim');
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason[id]) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin-claim-requests/${id}/reject`,
        { reason: rejectReason[id] }
      );
      toast.success('Claim rejected successfully');
      updateRequestState(id, { claimapproved: false, reason: rejectReason[id] });
    } catch (error) {
      console.error('Error rejecting claim:', error);
      console.log('Error Response:', error.response?.data);
      toast.error('Failed to reject claim');
    }
  };

  const updateRequestState = (id, updates) => {
    setClaimRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === id ? { ...request, ...updates } : request
      )
    );
  };

  const handleRejectReasonChange = (id, value) => {
    setRejectReason((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleCancelRejection = (id) => {
    setRejectReason((prevState) => {
      const updatedState = { ...prevState };
      delete updatedState[id];
      return updatedState;
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4 }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom align="center">
        Admin Claim Requests
      </Typography>
      <Grid container spacing={3}>
        {claimRequests.map((claim) => (
          <Grid item xs={12} key={claim._id}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                ...(claim.claimapproved || claim.reason
                  ? {
                      opacity: 0.5,
                      pointerEvents: 'none',
                    }
                  : {}),
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box sx={{ width: '45%', padding: 2 }}>
                  {claim.founditem_details ? (
                    <>
                      <Typography variant="h6">{claim.founditem_details.founditem_name}</Typography>
                      <Typography>Category: {claim.founditem_details.founditem_category}</Typography>
                      <Typography>Location: {claim.founditem_details.founditem_location}</Typography>
                      <Typography>
                        Date: {new Date(claim.founditem_details.founditem_date).toLocaleDateString()}
                      </Typography>
                      <Typography>Description: {claim.founditem_details.founditem_description}</Typography>
                      <Box
                        component="img"
                        src={
                          claim.founditem_details.founditem_image || 'https://placehold.co/100?text=No+Image'
                        }
                        alt={claim.founditem_details.founditem_name || 'No Image'}
                        sx={{ width: '40%', height: 'auto', borderRadius: 2, marginTop: 2 }}
                      />
                    </>
                  ) : (
                    <Typography color="error">Found item details not available</Typography>
                  )}
                </Box>

                <Box sx={{ width: '45%', padding: 2 }}>
                  <Typography variant="h6">Claim Details</Typography>
                  <Typography>Description: {claim.userclaim_description}</Typography>
                  <Box
                    component="img"
                    src={
                      claim.claim_image || 'https://placehold.co/100?text=No+Image'
                    }
                    alt="Claim Evidence"
                    sx={{ width: '40%', height: 'auto', borderRadius: 2, marginTop: 2 }}
                  />
                </Box>
              </Box>

              <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(claim._id)}
                    disabled={claim.claimapproved || claim.reason}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      setRejectReason((prevState) => ({
                        ...prevState,
                        [claim._id]: rejectReason[claim._id] || '',
                      }))
                    }
                    disabled={claim.claimapproved || claim.reason}
                  >
                    Reject
                  </Button>
                </Box>
                {rejectReason[claim._id] !== undefined && (
                  <Box sx={{ marginTop: 2 }}>
                    <TextField
                      required
                      label="Reason for Rejection"
                      fullWidth
                      value={rejectReason[claim._id]}
                      onChange={(e) => handleRejectReasonChange(claim._id, e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(claim._id)}
                      >
                        Submit Rejection
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleCancelRejection(claim._id)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminClaimRequest;
