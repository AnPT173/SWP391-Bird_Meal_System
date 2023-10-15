import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
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
  Menu,
  MenuItem,
  IconButton
} from '@material-ui/core';
// utils
import { foodsData } from '../../../utils/mock-data/food';
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';
import countries from './countries';


// ----------------------------------------------------------------------

StatusForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPlan: PropTypes.object
};

export default function StatusForm({ isEdit, currentPlan }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([{ name: '', error: false }]);
  const FoodPlanSchema = Yup.object().shape({
    products: Yup.array().of(
      Yup.object().shape({
        product: Yup.string().required('Product is required'),
        quantity: Yup.string().required('Quantity is required'),
      })
    ),
    water: Yup.string().required('Water Amount is required'),
    medicine: Yup.string().required('Medicine is required'),
    note: Yup.string().required('Note is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      products: currentPlan?.products || [{ product: '', quantity: '', error: false }],
      water: currentPlan?.water || '',
      medicine: currentPlan?.medicine || '',
      note: currentPlan?.note || '',
    },
    validationSchema: FoodPlanSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const newProducts = products.map((product) => product.name.trim());
        if (newProducts.some((product) => !product)) {
          const updatedProducts = products.map((product) => ({
            ...product,
            error: product.name.trim() === '',
          }));
          setProducts(updatedProducts);
          setSubmitting(false);
          return;
        }
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },

  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );
  const handleAddProductLine = () => {
    const newProduct = { product: '', quantity: '', error: false };
    formik.setFieldValue('products', [...values.products, newProduct]);
  };
  const handleProductChange = (e, index) => {
    const { value } = e.target;
    const newProducts = [...values.products];
    newProducts[index] = { ...newProducts[index], product: value, error: false };
    formik.setFieldValue('products', newProducts);
  };
  
  const handleQuantityChange = (e, index) => {
    const { value } = e.target;
    const newProducts = [...values.products];
    newProducts[index] = { ...newProducts[index], quantity: value, error: false };
    formik.setFieldValue('products', newProducts);
  };

  const handleDeleteProduct = (index) => {
    const newProducts = [...values.products];
    newProducts.splice(index, 1);
    formik.setFieldValue('products', newProducts);
  };
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction="column" spacing={2}>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton onClick={handleAddProductLine} color="primary">
                      Create Product
                    </LoadingButton>
                  </Box>
                  {values.products.map((product, index) => (
                    <Stack key={index} direction="row" spacing={2}>
                      <TextField
                        select
                        fullWidth
                        label={`Product ${index + 1}`}
                        value={values.products[index].product}                       
                        onChange={(e) => handleProductChange(e, index)}
                        error={product.error}
                        helperText={product.error ? 'Product is required' : ''}
                      >
                        {foodsData.map((option) => (
                          <MenuItem key={option.id} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        label="Quantity"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(e, index)}
                        error={product.error && !product.quantity}
                        helperText={product.error && !product.quantity ? 'Quantity is required' : ''}
                      />
                      <IconButton onClick={() => handleDeleteProduct(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Water Amount"
                    {...getFieldProps('water')}
                    error={Boolean(touched.water && errors.water)}
                    helperText={touched.water && errors.water}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Medicine"
                    {...getFieldProps('medicine')}
                    error={Boolean(touched.medicine && errors.medicine)}
                    helperText={touched.medicine && errors.medicine}

                  > <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                </Stack>
                <TextField

                  fullWidth
                  label="Medicine Details"
                  {...getFieldProps('medicineDetail')}
                  error={Boolean(touched.medicineDetail && errors.medicineDetail)}
                  helperText={touched.medicineDetail && errors.medicineDetail}
                />
                <TextField
                  fullWidth
                  label="Note"
                  {...getFieldProps('note')}
                  error={Boolean(touched.note && errors.note)}
                  helperText={touched.note && errors.note}
                />

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create' : 'Save Changes'}
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

