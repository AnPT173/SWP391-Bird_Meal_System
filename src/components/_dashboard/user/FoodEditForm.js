import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  MenuItem,
} from '@material-ui/core';
import { fData } from '../../../utils/formatNumber';
import { status } from '../../../utils/mock-data/status';
import { species } from '../../../utils/mock-data/species';
import { UploadAvatar } from '../../upload';
// utils
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';

FoodEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  onFormSubmit: PropTypes.func,
};

export default function FoodEditForm({ isEdit, currentProduct, onFormSubmit }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { productId } = useParams();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required'),
    category: Yup.string().required('Category is required'),
    expirePeriod: Yup.string().required('Expire Period is required'),
    quantity: Yup.string().required('Quantity is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct ? currentProduct.name : '',
      price: currentProduct ? currentProduct.price : '',
      category: currentProduct ? currentProduct.category : '',
      expirePeriod: currentProduct ? currentProduct.expirePeriod : '',
      quantity: currentProduct ? currentProduct.quantity : '',
      image: currentProduct ? currentProduct.image : null,
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.products);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { values, errors, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFieldValue('image', {
        ...file,
        preview: URL.createObjectURL(file),
      });
    }
  }, [setFieldValue]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formik.values.name}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formik.values.price}
                  {...getFieldProps('price')}
                  error={Boolean(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                />
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formik.values.category}
                  {...getFieldProps('category')}
                  error={Boolean(touched.category && errors.category)}
                  helperText={touched.category && errors.category}
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {/* Define your category options here */}
                </TextField>
                <TextField
                  fullWidth
                  label="Expire Period"
                  value={formik.values.expirePeriod}
                  {...getFieldProps('expirePeriod')}
                  error={Boolean(touched.expirePeriod && errors.expirePeriod)}
                  helperText={touched.expirePeriod && errors.expirePeriod}
                />
                <TextField
                  fullWidth
                  label="Quantity"
                  value={formik.values.quantity}
                  {...getFieldProps('quantity')}
                  error={Boolean(touched.quantity && errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Product' : 'Save Changes'}
                  </LoadingButton>
                  </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
