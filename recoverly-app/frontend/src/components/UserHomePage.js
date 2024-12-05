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

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/organizations');
                setOrganizations(response.data);
            } catch (error) {
                setMessage('Error fetching organizations');
            }
        };

        fetchOrganizations();
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/user-login');
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
                            <TableCell sx={{ borderBottom: "none", fontWeight: "bold" }}>
                                Requests
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none", fontWeight: "bold" }}>
                                Status
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none", fontWeight: "bold" }}>
                                Comments
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                sx={{ alignSelf: "flex-end" }}
            >
                Logout
            </Button>
        </Container>
    );
};

export default UserHomePage;
