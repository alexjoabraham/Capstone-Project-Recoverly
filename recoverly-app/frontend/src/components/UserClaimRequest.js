import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const UserClaimRequest = () => {
    const { itemId } = useParams(); 
    const [userDetails, setUserDetails] = useState({});
    const [claimDescription, setClaimDescription] = useState('');
    const [claimImage, setClaimImage] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/user-details');
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleImageChange = (event) => {
        setClaimImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('user_id', userDetails._id);
        formData.append('founditem_id', itemId);
        formData.append('claim_image', claimImage);
        formData.append('userclaim_description', claimDescription);

        try {
            await axios.post('http://localhost:5000/api/claims', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Claim request submitted successfully!');
        } catch (error) {
            console.error('Error submitting claim request:', error);
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
        </Container>
    );
};

export default UserClaimRequest;
