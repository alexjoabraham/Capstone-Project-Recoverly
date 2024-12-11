import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { Container, TextField, Button, Typography, Box, Card, CardContent, CardMedia } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserClaimRequest = () => {
    const { id } = useParams(); 
    console.log("Retrieved id:", id);
    const [userDetails, setUserDetails] = useState({});
    const [foundItem, setFoundItem] = useState(null); // State for found item details
    const [claimDescription, setClaimDescription] = useState('');
    const [claimImage, setClaimImage] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users/user-details', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
                toast.error('Failed to fetch user details.');
            }
        };

        const fetchFoundItem = async () => {
            try {
                // const response = await axios.get(`http://localhost:5000/api/users/items/${id}`);
                const response = await axios.get(`http://localhost:5000/api/users/found-item/${id}`);
                setFoundItem(response.data);  // Set found item details in state
            } catch (error) {
                console.error('Error fetching found item:', error);
                toast.error('Failed to fetch found item.');
            }
        };

        fetchUserDetails();
        fetchFoundItem();
    }, [id]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (file && allowedTypes.includes(file.type)) {
            setClaimImage(file);
            toast.success('Image selected successfully!');
        } else {
            toast.error('Only JPEG, JPG, PNG, or WEBP formats are allowed!');
            setClaimImage(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("Item ID:", id); 

        const formData = new FormData();
        formData.append('user_id', userDetails._id);
        formData.append('founditem_id', id);
        formData.append('claim_image', claimImage);
        formData.append('userclaim_description', claimDescription);

        try {
            await axios.post('http://localhost:5000/api/users/claim-item', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Claim request submitted successfully!');
        } catch (error) {
            console.error('Error submitting claim request:', error);
            toast.error(error.response?.data?.message || 'Error submitting claim');
        }
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Typography variant="h5" gutterBottom>
                Claim Request
            </Typography>
            
            {foundItem && (
            <Card sx={{ marginBottom: 4 }}>
            <CardContent>
                <Typography variant="h6">{foundItem.founditem_name}</Typography>
                <Typography variant="body2" color="textSecondary">Category: {foundItem.founditem_category}</Typography>
                <Typography variant="body2" color="textSecondary">Date Found: {formatDate(foundItem.founditem_date)}</Typography>
                <Typography variant="body2" color="textSecondary">Location: {foundItem.founditem_location}</Typography>
                <Typography variant="body2" color="textSecondary">{foundItem.founditem_description}</Typography>
            </CardContent>
        </Card>
            )}

            <form onSubmit={handleSubmit}>
                <Box sx={{ marginBottom: 2 }}>
                    <TextField
                        label="Name"
                        fullWidth
                        value={userDetails.user_name || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <TextField
                        label="Email"
                        fullWidth
                        value={userDetails.user_email || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <TextField
                        label="Phone Number"
                        fullWidth
                        value={userDetails.user_phone || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={claimDescription}
                        onChange={(e) => setClaimDescription(e.target.value)}
                        required
                    />
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <Button variant="contained" component="label">
                        Upload Image
                        <input type="file" hidden onChange={handleImageChange} />
                    </Button>
                </Box>
                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </Container>
    );
};

export default UserClaimRequest;
