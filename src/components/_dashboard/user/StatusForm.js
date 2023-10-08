import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
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
  MenuItem
} from '@material-ui/core';
// utils
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

  const FoodPlanSchema = Yup.object().shape({
    product1: Yup.string().required('Product 1 is required'),
    product2: Yup.string().required('Product 2 is required'),
    product3: Yup.string().required('Product 3 is required'),
    product4: Yup.string().required('Product 4 is required'),
    water: Yup.string().required('Water Amount is required'),
    medicine: Yup.string().required('Medicine is required'),
    note: Yup.string().required('Note is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      product1: currentPlan?.product1 || '',
      product2: currentPlan?.product2 || '',
      product3: currentPlan?.product3 || '',
      product4: currentPlan?.product4 || '',
      water: currentPlan?.water || '',
      medicine: currentPlan?.medicine || '',
      note: currentPlan?.note || '',
    },
    validationSchema: FoodPlanSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
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
    }
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

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Product 1"
                    {...getFieldProps('product1')}
                    error={Boolean(touched.product1 && errors.product1)}
                    helperText={touched.product1 && errors.product1}
                  />
                  <TextField
                    fullWidth
                    label="Product 2"
                    {...getFieldProps('product2')}
                    error={Boolean(touched.product2 && errors.product2)}
                    helperText={touched.product2 && errors.product2}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Product 3"
                    {...getFieldProps('product3')}
                    error={Boolean(touched.product3 && errors.product3)}
                    helperText={touched.product3 && errors.product3}
                  />
                  <TextField
                    fullWidth
                    label="Product 4"
                    {...getFieldProps('product4')}
                    error={Boolean(touched.product4 && errors.product4)}
                    helperText={touched.product4 && errors.product4}
                  />
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

