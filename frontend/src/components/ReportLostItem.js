import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, MenuItem, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Filter } from 'bad-words';

const categories = ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Others'];

const validationSchema = Yup.object({
  lostitem_name: Yup.string().required('Item name is required'),
  lostitem_location: Yup.string().required('Location is required'),
  lostitem_description: Yup.string().required('Description is required'),
  lostitem_category: Yup.string().required('Category is required'),
  lostitem_date: Yup.date().required('Date is required').nullable(),
});

const ReportLostItem = () => {
  const [image, setImage] = React.useState(null);
  const [imageName, setImageName] = React.useState('');
  const filter = new Filter();

  const formik = useFormik({
    initialValues: {
      lostitem_name: '',
      lostitem_location: '',
      lostitem_description: '',
      lostitem_category: '',
      lostitem_date: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const fieldsWithProfanity = [];

      if (filter.isProfane(values.lostitem_name)) fieldsWithProfanity.push('Item Name');
      if (filter.isProfane(values.lostitem_location)) fieldsWithProfanity.push('Location');
      if (filter.isProfane(values.lostitem_description)) fieldsWithProfanity.push('Description');

      if (fieldsWithProfanity.length > 0) {
        toast.error(`Please remove offensive language from: ${fieldsWithProfanity.join(', ')}`);
        return;
      }

      if (values.lostitem_date === null || values.lostitem_date === '') {
        values.lostitem_date = null;
      }

      const token = localStorage.getItem('token'); 
      let userId = null;

      if (token) {
        try {
          const decoded = jwtDecode(token);
          userId = decoded.id;
        } catch (error) {
          toast.error('Invalid token. Please log in again.');
          return;
        }
      } else {
        toast.error('No token found. Please log in.');
        return;
      }

      const formData = new FormData();
      formData.append('lostitem_name', values.lostitem_name);
      formData.append('lostitem_location', values.lostitem_location);
      formData.append('lostitem_description', values.lostitem_description);
      formData.append('lostitem_category', values.lostitem_category);
      formData.append('lostitem_date', values.lostitem_date);
      formData.append('user_id', userId);
      if (image) {
        formData.append('lostitem_image', image);
      }

      try {
        await axios.post('http://localhost:5000/api/lost-items/report-lost-item', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Lost item reported successfully!');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error reporting lost item';
        toast.error(errorMessage);
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file ? file.name : '');
  };

  const handleRemoveFile = () => {
    setImage(null);
    setImageName('');
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: 4 }}>
      <Typography variant="h5" gutterBottom>Report Lost Item</Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Item Name"
          fullWidth
          name="lostitem_name"
          value={formik.values.lostitem_name}
          onChange={formik.handleChange}
          error={formik.touched.lostitem_name && Boolean(formik.errors.lostitem_name)}
          helperText={formik.touched.lostitem_name && formik.errors.lostitem_name}
          margin="normal"
        />
        <TextField
          label="Lost Location"
          fullWidth
          name="lostitem_location"
          value={formik.values.lostitem_location}
          onChange={formik.handleChange}
          error={formik.touched.lostitem_location && Boolean(formik.errors.lostitem_location)}
          helperText={formik.touched.lostitem_location && formik.errors.lostitem_location}
          margin="normal"
        />
        <TextField
          label="Item Description"
          fullWidth
          multiline
          rows={4}
          name="lostitem_description"
          value={formik.values.lostitem_description}
          onChange={formik.handleChange}
          error={formik.touched.lostitem_description && Boolean(formik.errors.lostitem_description)}
          helperText={formik.touched.lostitem_description && formik.errors.lostitem_description}
          margin="normal"
        />
        <TextField
          label="Category"
          select
          fullWidth
          name="lostitem_category"
          value={formik.values.lostitem_category}
          onChange={formik.handleChange}
          error={formik.touched.lostitem_category && Boolean(formik.errors.lostitem_category)}
          helperText={formik.touched.lostitem_category && formik.errors.lostitem_category}
          margin="normal"
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={formik.values.lostitem_date}
            name="lostitem_date"
            onChange={(newDate) => formik.setFieldValue('lostitem_date', newDate)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" error={formik.touched.lostitem_date && Boolean(formik.errors.lostitem_date)} helperText={formik.touched.lostitem_date && formik.errors.lostitem_date} />
            )}
          />
        </LocalizationProvider>

        <TextField
          label="Image"
          fullWidth
          value={imageName}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button variant="contained" component="label">
                    Choose File
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </InputAdornment>
                {image && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleRemoveFile}>
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                )}
              </>
            ),
          }}
          margin="normal"
        />

        <Button variant="contained" color="primary" fullWidth type="submit">
          Submit
        </Button>
      </form>

      <ToastContainer />
    </Box>
  );
};

export default ReportLostItem;
