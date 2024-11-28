import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Container, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // Track index being edited

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddOrEditEmail = () => {
    if (!newEmail) {
      setError("Please enter an email address.");
      return;
    }

    if (!isValidEmail(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (editingIndex !== null) {
      // Edit email at the specified index
      const updatedEmails = [...emails];
      updatedEmails[editingIndex].email = newEmail;
      setEmails(updatedEmails);
      setEditingIndex(null);
    } else {
      // Add a new email if not already in the list
      if (emails.find((e) => e.email === newEmail)) {
        setError("This email is already in the list.");
        return;
      }
      setEmails([...emails, { email: newEmail, disabled: false }]);
    }

    setNewEmail("");
    setError(""); // Clear error if email is valid
  };

  const handleRemoveEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleEditEmail = (index) => {
    setNewEmail(emails[index].email);
    setEditingIndex(index);
  };

  const handleDisableEmail = (index) => {
    const updatedEmails = [...emails];
    updatedEmails[index].disabled = !updatedEmails[index].disabled;
    setEmails(updatedEmails);
  };

  const handleNotify = () => {
    const activeEmails = emails.filter(email => !email.disabled);
    if (activeEmails.length === 0) {
      alert("No active emails to notify.");
      return;
    }
    alert(`Notifications sent to: ${activeEmails.map(e => e.email).join(", ")}`);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Email List
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <TextField
            fullWidth
            type="email"
            label="Enter email"
            variant="outlined"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
          <Button variant="contained" color="primary" onClick={handleAddOrEditEmail}>
            {editingIndex !== null ? "Save" : "Add Email"}
          </Button>
        </Box>
        <List>
          {emails.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <Box>
                  <IconButton color="primary" onClick={() => handleEditEmail(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color={item.disabled ? "success" : "warning"}
                    onClick={() => handleDisableEmail(index)}
                  >
                    {item.disabled ? <CheckIcon /> : <BlockIcon />}
                  </IconButton>
                  <IconButton color="error" onClick={() => handleRemoveEmail(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={item.email}
                sx={{
                  textDecoration: item.disabled ? "line-through" : "none",
                  color: item.disabled ? "gray" : "inherit"
                }}
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleNotify}
          sx={{ mt: 2 }}
        >
          Notify
        </Button>
      </Box>
    </Container>
  );
}

export default EmailList;
