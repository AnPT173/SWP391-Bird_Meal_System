import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { Box, Card, FormControlLabel, FormHelperText, Grid, MenuItem, Stack, TextField, Typography } from '@material-ui/core';
import { DatePicker, LoadingButton } from '@material-ui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBird } from '../../../redux/slices/bird';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { fData } from '../../../utils/formatNumber';
import { species } from '../../../utils/mock-data/species';
import { UploadAvatar } from '../../upload';


export default function NewBirdForm({location}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [birdImage, setBirdImage] = useState();
  const [isExoticChecked, setExoticChecked] = useState(false);

  const { cageId } = useParams();
  
  const NewBirdSchema = Yup.object().shape({
    birdName: Yup.string(),
    birdAge: Yup.number(),
    status: Yup.string(),
    species: Yup.string(),
    avatarUrl: Yup.mixed(),
    birdGender: Yup.string(),
    hatchingDate: Yup.string(),
    attitudes: Yup.string(),
    featherColor: Yup.string(),
    appearance: Yup.string(),
    qualities: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      birdName: '',
      birdAge: '',
      status: '',
      species: '',
      cageId,
      avatarUrl: null,
      birdGender: '',
      hatchingDate: '',
      attitudes: '',
      featherColor: '',
      area: location,
      appearance: '',
      qualities: '',
    },
    validationSchema: NewBirdSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {

        dispatch(createBird({ ...values, file: birdImage }));
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        navigate(`${PATH_DASHBOARD.cages.root}/${cageId}/birds`);
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
        setBirdImage(file);
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file),
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
            <Card sx={{ py: 10, px: 3 }}>
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
                <FormControlLabel
                  control={
                    <input
                      type="checkbox"
                      checked={isExoticChecked}
                      onChange={(e) => setExoticChecked(e.target.checked)}
                    />
                  }
                  label="Exotic Rate"
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Bird Name"
                    {...getFieldProps('birdName')}
                    error={Boolean(touched.birdName && errors.birdName)}
                    helperText={touched.birdName && errors.birdName}
                  />
                  <TextField
                    fullWidth
                    label="Bird Age"
                    type="number"
                    {...getFieldProps('birdAge')}
                    error={Boolean(touched.birdAge && errors.birdAge)}
                    helperText={touched.birdAge && errors.birdAge}
                  />
                                    <TextField
                    select
                    fullWidth
                    label="Status"
                    {...getFieldProps('status')}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="" disabled>
                      Select Status
                    </MenuItem>
                    <MenuItem value="1">Normal</MenuItem>
                    <MenuItem value="2">Sick</MenuItem>
                    <MenuItem value="3">Birth</MenuItem>
                  </TextField>
                  {isExoticChecked && (
                    <TextField
                      fullWidth
                      label="Exotic Rate (%)"
                      type="number"
                      {...getFieldProps('exoticRate')}
                      error={Boolean(touched.exoticRate && errors.exoticRate)}
                      helperText={touched.exoticRate && errors.exoticRate}
                    />
                  )
                  }
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <TextField
                    disabled
                    fullWidth
                    label="Location"
                    value={location?.name}
/>
                  <TextField
                    
                    disabled
                    fullWidth
                    label="Cage"
                    value={`CA-${cageId}`}
                    />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <TextField
                    select
                    fullWidth
                    label="Bird Gender"
                    {...getFieldProps('birdGender')}
                    error={Boolean(touched.birdGender && errors.birdGender)}
                    helperText={touched.birdGender && errors.birdGender}
                  >
                    <MenuItem value="" disabled>
                      Select Gender
                    </MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
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
                  
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <DatePicker
                    fullWidth
                    label="Hatching Date"
                    value={formik.values.hatchingDate}
                    onChange={(date) => {
                      formik.setFieldValue('hatchingDate', date);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    error={Boolean(touched.hatchingDate && errors.hatchingDate)}
                    helperText={touched.hatchingDate && errors.hatchingDate}
                  />
                  <TextField
                    fullWidth
                    label="Attitudes"
                    {...getFieldProps('attitudes')}
                    error={Boolean(touched.attitudes && errors.attitudes)}
                    helperText={touched.attitudes && errors.attitudes}
                  />


                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>

                <TextField
                    fullWidth
                    label="Feather Color"
                    {...getFieldProps('featherColor')}
                    error={Boolean(touched.featherColor && errors.featherColor)}
                    helperText={touched.featherColor && errors.featherColor}
                    />
                <TextField
                  fullWidth
                  label="Appearance"
                  {...getFieldProps('appearance')}
                  error={Boolean(touched.appearance && errors.appearance)}
                  helperText={touched.appearance && errors.appearance}
                  />
                  </Stack>
                <TextField
                  fullWidth
                  label="Qualities"
                  {...getFieldProps('qualities')}
                  error={Boolean(touched.qualities && errors.qualities)}
                  helperText={touched.qualities && errors.qualities}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Create Bird
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
