import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { DatePicker, LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack, TextField, Typography, FormHelperText, FormControlLabel, MenuItem } from '@material-ui/core';
import { fData } from '../../../utils/formatNumber';
import { species } from '../../../utils/mock-data/species';
import fakeRequest from '../../../utils/fakeRequest';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { UploadAvatar } from '../../upload';
import { getBirdData, getCageData, saveBirdData } from '../../../utils/mock-data/localStorageUtil';

// +// {
// +//   "name": "test",
// +//   "age": "2023-01-01",
// +//   "birdTypeID": {
// +//     "id": "1",
// +//     "name": "1",
// +//     "specieID": {
// +//       "id": "1",
// +//       "name": "1"
// +//     }
// +//   },
// +//   "cageID": "1"
// +// }



export default function CreateNewBirdForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { cageId } = useParams();
  const [ birdData, setBirdData ] = useState([]);
  const [cagesData, setCagesData ] = useState([]);
  
  useEffect( async ()=>{
    const data = await getBirdData();
    setBirdData(data);
    const data2 = await getCageData();
    setCagesData(data2);
  },[])

  const NewBirdSchema = Yup.object().shape({
    birdName: Yup.string().required('Bird Name is required'),
    birdAge: Yup.number().required('Bird Age is required'),
    status: Yup.string().required('Status is required'),
    species: Yup.string().required('Species is required'),
    cageId: Yup.string().required('Cage is required'),
    avatarUrl: Yup.mixed().required('Avatar is required'),
    birdGender: Yup.string().required('Bird Gender is required'),
    hatchingDate: Yup.date().required('Hatching Date is required'),
    attitudes: Yup.string().required('Attitudes is required'), // Add attitudes field
    featherColor: Yup.string().required('Feather Color is required'), // Add featherColor field
    appearance: Yup.string().required('Appearance is required'), // Add appearance field
    qualities: Yup.string().required('Qualities is required'), // Add qualities field
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
      hatchingDate: null,
      attitudes: '', // Add attitudes field
      featherColor: '', // Add featherColor field
      appearance: '', // Add appearance field
      qualities: '', // Add qualities field
    },
    validationSchema: NewBirdSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const birdId = `BIRD${birdData.length}`;
        await fakeRequest(500);
        await saveBirdData([...birdData, {...values, birdId}])
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
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file),
        });
      }
    },
    [setFieldValue]
  );
  const [isExoticChecked, setExoticChecked] = useState(false);

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
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Sick">Sick</MenuItem>
                    <MenuItem value="Birth">Birth</MenuItem>
                  </TextField>
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
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Cage"
                    value={cageId}
                    {...getFieldProps('cageId')}
                    error={Boolean(touched.cageId && errors.cageId)}
                    helperText={touched.cageId && errors.cageId}
                  >
                    {cagesData.map((option) => (
                      <MenuItem key={option.cageID} value={option.cageID}>
                        {option.cageID}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
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
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Attitudes"
                    {...getFieldProps('attitudes')}
                    error={Boolean(touched.attitudes && errors.attitudes)}
                    helperText={touched.attitudes && errors.attitudes}
                  />
                  <TextField
                    fullWidth
                    label="Feather Color"
                    {...getFieldProps('featherColor')}
                    error={Boolean(touched.featherColor && errors.featherColor)}
                    helperText={touched.featherColor && errors.featherColor}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Area"
                    {...getFieldProps('area')}
                    error={Boolean(touched.area && errors.area)}
                    helperText={touched.area && errors.area}
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Birth">Birth</MenuItem>
                    <MenuItem value="Sick">Sick</MenuItem>
                    <MenuItem value="Exotic">Exotic</MenuItem>
                  </TextField>
                </Stack>
                <TextField
                  fullWidth
                  label="Appearance"
                  {...getFieldProps('appearance')}
                  error={Boolean(touched.appearance && errors.appearance)}
                  helperText={touched.appearance && errors.appearance}
                />
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
