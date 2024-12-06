import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Container, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';

function EmailList({ adminId }) {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`/api/admins/emails/${adminId}`);
      setEmails(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleAddOrEditEmail = async () => {
    if (!newEmail) {
      setError("Please enter an email address.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      if (editingIndex !== null) {
        const updatedEmails = [...emails];
        updatedEmails[editingIndex].email = newEmail;
        setEmails(updatedEmails);
        setEditingIndex(null);
      } else {
        const response = await axios.post('/api/admins/emails', { adminId, email: newEmail });
        setEmails([...emails, response.data]);
      }
      setNewEmail("");
      setError("");
    } catch (error) {
      console.error('Error adding or editing email:', error);
    }
  };

  const handleRemoveEmail = async (emailId) => {
    try {
      await axios.delete(`/api/admins/emails/${emailId}`);
      setEmails(emails.filter((email) => email._id !== emailId));
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const handleEditEmail = (index) => {
    setNewEmail(emails[index].email);
    setEditingIndex(index);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>Email List</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Enter email"
            variant="outlined"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
          <Button variant="contained" onClick={handleAddOrEditEmail}>
            {editingIndex !== null ? "Save" : "Add"}
          </Button>
        </Box>
        <List>
          {emails.map((email, index) => (
            <ListItem key={email._id} secondaryAction={
              <>
                <IconButton onClick={() => handleEditEmail(index)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleRemoveEmail(email._id)}><DeleteIcon /></IconButton>
              </>
            }>
              <ListItemText primary={email.email} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default EmailList;
