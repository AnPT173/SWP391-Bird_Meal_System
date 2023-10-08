import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate, useParams } from 'react-router-dom';
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
  MenuItem,
  Avatar,
} from '@material-ui/core';
import { status } from '../../../utils/mock-data/status';
import { species } from '../../../utils/mock-data/species';
import { cagesData } from '../../../utils/mock-data/cage';
import { birdsData } from '../../../utils/mock-data/bird';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';


BirdProfileForm.propTypes = {
  isEdit: PropTypes.bool,
  currentBird: PropTypes.object,
};

export default function BirdProfileForm({ isEdit }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { birdId } = useParams();

  const NewBirdSchema = Yup.object().shape({
    birdName: Yup.string().required('Bird Name is required'),
    birdAge: Yup.number().required('Bird Age is required'),
    status: Yup.string().required('Status is required'),
    species: Yup.string().required('Species is required'),
    cageId: Yup.string().required('Cage is required'),
    foodQuantity: Yup.number().required('Food Quantity is required'),
    avatarUrl: Yup.mixed().required('Avatar is required'),
  });

  const currentBird = birdsData.find((bird) => bird.birdId === birdId);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      birdId: currentBird ? currentBird.birdId : '',
      birdName: currentBird ? currentBird.birdName : '',
      birdAge: currentBird ? currentBird.birdAge : '',
      status: currentBird ? currentBird.status : '',
      species: currentBird ? currentBird.species : '',
      cageId: currentBird ? currentBird.cageId : '',
      foodQuantity: currentBird ? currentBird.foodQuantity : '',
      avatarUrl: currentBird ? currentBird.avatarUrl : null,
    },
    validationSchema: NewBirdSchema,
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
    },
  });
  const { values, errors, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFieldValue('avatarUrl', {
        ...file,
        preview: URL.createObjectURL(file),
      });
    }
  }, [setFieldValue]);
  console.log("values", values)
  let color = 'info'; 

  if (currentBird) {
    if (currentBird.status === 'Normal') {
      color = 'success'; 
    } else if (currentBird.status === 'Birth') {
      color = 'warning'; 
    } else if (currentBird.status === 'Sick') {
      color = 'error'; 
    }
  }
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              {isEdit && (
                <Label
                  color={color}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {currentBird && currentBird.status}
                </Label>
              )}
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={formik.values.avatarUrl || (currentBird && currentBird.avatarUrl)}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.avatarUrl && errors.avatarUrl)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Bird ID"
                    value={formik.values.birdId}
                    {...getFieldProps('birdId')}
                    error={Boolean(touched.birdId && errors.birdId)}
                    helperText={touched.birdId && errors.birdId}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Bird Name"
                    value={formik.values.birdName}
                    {...getFieldProps('birdName')}
                    error={Boolean(touched.birdName && errors.birdName)}
                    helperText={touched.birdName && errors.birdName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Age"
                    value={formik.values.birdAge}
                    {...getFieldProps('birdAge')}
                    error={Boolean(touched.birdAge && errors.birdAge)}
                    helperText={touched.birdAge && errors.birdAge}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    value={formik.values.status}
                    {...getFieldProps('status')}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="" disabled>
                      Select Status
                    </MenuItem>
                    {status.map((option) => (
                      <MenuItem key={option.status_id} value={option.status}>
                        {option.status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Species"
                    value={formik.values.species}
                    {...getFieldProps('species')}
                    error={Boolean(touched.species && errors.species)}
                    helperText={touched.species && errors.species}
                  >
                    <MenuItem value="" disabled>
                      Select Species
                    </MenuItem>
                    {species.map((option) => (
                      <MenuItem key={option.speciesID} value={option.specie}>
                        {option.specie}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Cage"
                    value={formik.values.cageId}
                    {...getFieldProps('cageId')}
                    error={Boolean(touched.cageId && errors.cageId)}
                    helperText={touched.cageId && errors.cageId}
                  >
                    <MenuItem value="" disabled>
                      Select Cage
                    </MenuItem>
                    {cagesData.map((option) => (
                      <MenuItem key={option.cageID} value={option.cageID}>
                        {option.cageID}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Food Quantity"
                    value={formik.values.foodQuantity}
                    {...getFieldProps('foodQuantity')}
                    error={Boolean(touched.foodQuantity && errors.foodQuantity)}
                    helperText={touched.foodQuantity && errors.foodQuantity}
                  />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Bird' : 'Save Changes'}
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
