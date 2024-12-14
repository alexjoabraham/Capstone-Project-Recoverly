import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Button,
  Modal,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DisabledByDefault as DisabledByDefaultIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const EmailListPage = () => {
  const [adminId, setAdminId] = useState(null);
  const [token, setToken] = useState(null);
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState({
    greeting: "",
    secureCode: "",
    thankYou: "Thank you for using our Lost and Found service.",
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
      const decoded = jwtDecode(token);
      setAdminId(decoded?.id);
      fetchEmailList(decoded.id, token);
    }
  }, []);

  const fetchEmailList = async (adminId, token) => {
    try {
      const response = await axios.get("https://recoverly-app-41d86cc43289.herokuapp.com/api/email-list", {
        headers: { Authorization: `Bearer ${token}` },
        params: { adminId },
      });
      setEmails(response.data);
    } catch (error) {
      console.error("Error fetching email list:", error);
      toast.error("Failed to fetch email list.");
    }
  };

  const handleDelete = async (emailId) => {
    try {
      await axios.delete(
        `https://recoverly-app-41d86cc43289.herokuapp.com/api/email-list/${emailId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Email deleted successfully.");
      fetchEmailList(adminId, token);
    } catch (error) {
      toast.error("Failed to delete email.");
    }
  };

  const handleDisable = async (emailId) => {
    try {
      await axios.put(
        `https://recoverly-app-41d86cc43289.herokuapp.com/api/email-list/${emailId}/disable`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Email disabled successfully.");
      fetchEmailList(adminId, token);
    } catch (error) {
      toast.error("Failed to disable email.");
    }
  };

  const handleEnable = async (emailId) => {
    try {
      await axios.put(
        `https://recoverly-app-41d86cc43289.herokuapp.com/api/email-list/${emailId}/enable`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Email enabled successfully.");
      fetchEmailList(adminId, token);
    } catch (error) {
      toast.error("Failed to enable email.");
    }
  };

  const toggleAddForm = () => {
    setShowAddForm((prev) => !prev);
  };

  const handleEditClick = (email) => {
    setEditingEmail(email);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(
        `https://recoverly-app-41d86cc43289.herokuapp.com/api/email-list/${editingEmail._id}/update`,
        { name: values.name, email: values.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Email updated successfully!");
      fetchEmailList(adminId, token);
      setEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update email.");
    }
  };

  const handleNotify = async () => {
    try {
      await axios.post(
        "https://recoverly-app-41d86cc43289.herokuapp.com/api/email-list/notify",
        { adminId, secureCode: emailContent.secureCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Notifications sent successfully!");
      setNotifyModalOpen(false);
    } catch (error) {
      toast.error("Failed to send notifications.");
    }
  };

  const filteredEmails = emails.filter((email) =>
    email.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Email List
      </Typography>

      <TextField
        label="Search Emails"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      {filteredEmails.length > 0 ? (
        filteredEmails.map((email) => (
          <Paper
            key={email._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              marginBottom: 2,
              backgroundColor: email.disabled ? "lightgray" : "white",
              color: email.disabled ? "gray" : "black",
            }}
          >
            <Typography>
              {email.name} - {email.email}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Edit">
                <IconButton onClick={() => handleEditClick(email)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(email._id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              {email.disabled ? (
                <Tooltip title="Enable">
                  <IconButton onClick={() => handleEnable(email._id)}>
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Disable">
                  <IconButton onClick={() => handleDisable(email._id)}>
                    <DisabledByDefaultIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Paper>
        ))
      ) : (
        <Typography>No emails found.</Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 3,
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<NotificationsIcon />}
          onClick={() => setNotifyModalOpen(true)}
        >
          Notify
        </Button>
        <Button variant="contained" color="primary" onClick={toggleAddForm}>
          {showAddForm ? "Cancel" : "Add New Email"}
        </Button>
      </Box>
      <Modal open={notifyModalOpen} onClose={() => setNotifyModalOpen(false)}>
        <Box
          sx={{
            maxWidth: 400,
            margin: "auto",
            marginTop: 10,
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Email Notification
          </Typography>
          <TextField
            label="Secure Code"
            fullWidth
            value={emailContent.secureCode}
            onChange={(e) =>
              setEmailContent({ ...emailContent, secureCode: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNotify}
          >
            Send Notifications
          </Button>
        </Box>
      </Modal>


      {showAddForm && (
        <Box sx={{ marginTop: 4 }}>
          <Formik
            initialValues={{ name: "", email: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await axios.post(
                  "https://recoverly-app-41d86cc43289.herokuapp.com/api/email-list/add",
                  { admin_id: adminId, name: values.name, email: values.email },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Email added successfully!");
                fetchEmailList(adminId, token);
                setShowAddForm(false); 
              } catch (error) {
                toast.error("Failed to add email.");
              }
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting, handleChange, values }) => (
              <Form>
                <TextField
                  label="Enter Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Enter Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      )}

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            maxWidth: 400,
            margin: "auto",
            marginTop: 10,
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Email
          </Typography>
          {editingEmail && (
            <Formik
              initialValues={{
                name: editingEmail.name,
                email: editingEmail.email,
              }}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ errors, touched, handleChange, values, isSubmitting }) => (
                <Form>
                  <TextField
                    label="Edit Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Edit Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ marginBottom: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Update
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default EmailListPage;
