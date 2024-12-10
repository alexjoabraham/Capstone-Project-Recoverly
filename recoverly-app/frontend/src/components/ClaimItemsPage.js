import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, CardActions, Button, Typography, Grid, Box } from '@mui/material';

const ClaimItemsPage = () => {
    const [foundItems, setFoundItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFoundItems = async () => {
            try {
                const organizationName = sessionStorage.getItem('organizationName');
                const secureCode = sessionStorage.getItem('secureCode');

                if (!organizationName || !secureCode) {
                    console.error('Organization data missing in session storage.');
                    navigate('/user-home');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/users/found-items', {
                    params: {
                        organization_name: organizationName,
                        organization_securecode: secureCode,
                    },
                });

                setFoundItems(response.data);
            } catch (error) {
                console.error('Error fetching found items:', error);
            }
        };

        fetchFoundItems();
    }, [navigate]);

    const handleClaim = (itemId) => {
        const organizationName = sessionStorage.getItem('organizationName');
        const secureCode = sessionStorage.getItem('secureCode');

        if (!organizationName || !secureCode) {
            console.error('Organization data missing in session storage.');
            alert('Organization data is missing. Please re-login.');
            navigate('/user-home');
            return;
        }

        console.log(`Claiming item with ID: ${itemId}`);
        navigate(`/claim-request/${itemId}`);
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                Claim Items
            </Typography>

            {foundItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <Typography variant="h6" color="textSecondary">
                        No items found to claim at the moment. Please check back later.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {foundItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">{item.founditem_name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Category: {item.founditem_category}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Date Found: {new Date(item.founditem_date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Location: {item.founditem_location}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Description: {item.founditem_description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleClaim(item._id)}
                                        sx={{ margin: 'auto' }}
                                    >
                                        Claim
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ClaimItemsPage;
