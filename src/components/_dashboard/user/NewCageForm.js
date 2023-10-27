import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { Box, Card, FormHelperText, Grid, MenuItem, Stack, TextField, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCage } from '../../../redux/slices/cage';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { fData } from '../../../utils/formatNumber';
import { cageType } from '../../../utils/mock-data/cage';
import { species } from '../../../utils/mock-data/species';
import { UploadAvatar } from '../../upload';

export default function CreateNewCageForm({location}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [cageImage, setCageImage] = useState();


  const NewCageSchema = Yup.object().shape({
    species: Yup.string().required('Species is required'),
    cageType: Yup.string().required('Cage Type is required'),
    avatarUrl: Yup.mixed().required('Cage imnage is required'),
    quantity: Yup.number().required('Number of bird is required')
  });

  const formik = useFormik({
    initialValues: {
      species: '',
      cageType: '',
      quantity: '',
      avatarUrl: null
    },
    validationSchema: NewCageSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        dispatch(createCage({ ...values, location, file: cageImage }));
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        navigate(PATH_DASHBOARD.cages.cards);
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
        setCageImage(file);
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
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 2, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.avatarUrl}
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
                        color: 'text.secondary'
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
              <Stack spacing={5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Species"
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
                    label="Cage Type"
                    {...getFieldProps('cageType')}
                    error={Boolean(touched.cageType && errors.cageType)}
                    helperText={touched.cageType && errors.cageType}
                  >
                    <MenuItem value="" disabled>
                      Select Cage Type
                    </MenuItem>
                    {cageType.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField fullWidth 
                  label="Location" 
                  disabled 
                  value={location.name} 
                  />

                  <TextField
                    fullWidth
                    label="Number of Bird"
                    {...getFieldProps('quantity')}
                    error={Boolean(touched.qualities && errors.qualities)}
                    helperText={touched.qualities && errors.qualities}
                  />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Create Cage
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
