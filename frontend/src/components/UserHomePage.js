import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';

const BackgroundBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e7d8cd',
    padding: '50px 20px',
    textAlign: 'left',
    borderRadius: '8px',
    marginBottom: '30px',
  });
  
  const ContentBox = styled(Box)({
    flex: 1,
    paddingLeft: '20px',
    paddingRight: '140px',
  });
  
  const ImageBox = styled(Box)({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });
  
  const StyledImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
  });
  
  const DividerLine = styled(Box)({
    width: '2px',
    height: '80%',
    backgroundColor: '#ddd',
    margin: '0 20px',
  });

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
                const response = await axios.get('https://recoverly-app-41d86cc43289.herokuapp.com/api/users/organizations');
                setOrganizations(response.data);
            } catch (error) {
                setMessage('Error fetching organizations');
            }
        };

        const fetchClaims = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get('https://recoverly-app-41d86cc43289.herokuapp.com/api/users/claims', {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                console.log('Fetched Claims:', response.data);
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
            const response = await axios.post('https://recoverly-app-41d86cc43289.herokuapp.com/api/users/validate-organization', {
                organization_name: organizationName,
                organization_securecode: secureCode,
            });
            setMessage(response.data.message);
            if (response.data.success) {
                sessionStorage.setItem('organizationName', organizationName);
                sessionStorage.setItem('secureCode', secureCode);

                navigate('/claim-items');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error validating organization');
        }
    };

    return (
        <Container maxWidth="xl">
            <BackgroundBox>
                <ImageBox>
                    <StyledImage src="/images/Hero_UserHome_Recoverly.png" alt="User Dashboard Hero" />
                </ImageBox>
                <DividerLine />
                <ContentBox>
                    <Typography variant="h4" gutterBottom>
                        Welcome to Recoverly User Portal
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Use the form below to securely connect to your organization's account. View your organization's requests and monitor the status of each.
                    </Typography>
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
                        <InputLabel id="organization-name-label">Organization Name</InputLabel>
                            <Select
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                labelId="organization-name-label"
                                label="Organization Name"
                                inputProps={{ 'aria-labelledby': 'organization-name-label' }} 
                            >
                                {organizations.map((org) => (
                                    <MenuItem key={org._id} value={org.organization_name} aria-label={org.organization_name}>
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
                </ContentBox>
            </BackgroundBox>

            <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Your Claims
                </Typography>
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
                                    {claim.status}
                                </TableCell>
                                <TableCell>{claim.comments || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default UserHomePage;
