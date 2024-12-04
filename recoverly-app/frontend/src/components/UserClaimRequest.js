import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserClaimRequest = () => {
    const { id } = useParams(); 
    console.log("Retrieved id:", id);
    const [userDetails, setUserDetails] = useState({});
    const [claimDescription, setClaimDescription] = useState('');
    const [claimImage, setClaimImage] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users/user-details', {
                    headers: {
                        Authorization: `Bearer ${token}`  // Include the token in the request header
                    }
                });
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
                toast.error('Failed to fetch user details.');
            }
        };

        fetchUserDetails();
    }, []);

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

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Typography variant="h5" gutterBottom>
                Claim Request
            </Typography>
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
