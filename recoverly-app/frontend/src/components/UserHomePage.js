import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const UserHomePage = () => {
    const navigate = useNavigate();
    const [organizationName, setOrganizationName] = useState('');
    const [secureCode, setSecureCode] = useState('');
    const [message, setMessage] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [claims, setClaims] = useState([]);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/organizations');
                setOrganizations(response.data);
            } catch (error) {
                setMessage('Error fetching organizations');
            }
        };

        const fetchClaims = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get('http://localhost:5000/api/users/claims', {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setClaims(response.data); 
            } catch (error) {
                console.error('Error fetching claims:', error);
            }
        };

        fetchOrganizations();
        fetchClaims();
    }, []);

    const handleValidation = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/validate-organization', {
                organization_name: organizationName,
                organization_securecode: secureCode,
            });
            setMessage(response.data.message);
            if (response.data.success) {
                navigate('/claim-items');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error validating organization');
        }
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Box
                component="img"
                src="/images/Hero_UserHome_Recoverly.webp"
                alt="Hero"
                sx={{ width: "100%", height: "auto", borderRadius: 2, marginBottom: 4 }}
            />

            <Box
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    marginBottom: 4,
                }}
            >
                <FormControl fullWidth>
                    <InputLabel>Organization Name</InputLabel>
                    <Select
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        label="Organization Name"
                    >
                        {organizations.map((org) => (
                            <MenuItem key={org._id} value={org.organization_name}>
                                {org.organization_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Secure Code"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={secureCode}
                    onChange={(e) => setSecureCode(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleValidation}>
                    Submit
                </Button>
            </Box>

            <Typography variant="body1" color="textSecondary" paragraph>
                {message}
            </Typography>

            <Typography variant="body1" paragraph>
                Welcome to the user portal. Here, you can access your organization’s
                requests and monitor the status of each. Use the form above to securely
                connect to your organization's account.
            </Typography>

            <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Request</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Comments</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {claims.map((claim) => (
                            <TableRow key={claim._id}>
                                <TableCell>{claim.founditem_name || 'N/A'}</TableCell>
                                <TableCell>
                                    {claim.claimapproved
                                        ? 'Claim Approved'
                                        : claim.reason
                                        ? 'Claim Rejected'
                                        : 'Pending with Admin'}
                                </TableCell>
                                <TableCell>{claim.reason || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default UserHomePage;
