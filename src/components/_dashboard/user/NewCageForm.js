import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// material
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  MenuItem,
  Button,
} from '@mui/material';
import { species } from '../../../utils/mock-data/species';
import { cagesID, cageType, cagesData } from '../../../utils/mock-data/cage';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import { UploadAvatar } from '../../upload';
import { getCageData, getCurrentLocation, saveCageData } from '../../../utils/mock-data/localStorageUtil';
import { createCage } from '../../../redux/slices/cage';

export default function CreateNewCageForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  

  const NewCageSchema = Yup.object().shape({
    species: Yup.string().required('Species is required'),
    cageType: Yup.string().required('Cage Type is required'),
  });

  const createNewCage = async (values) => {
    try {

      const location = await getCurrentLocation();
      // POST API
      dispatch(createCage({...values, location}))

      enqueueSnackbar('Create success', { variant: 'success' });
      navigate(PATH_DASHBOARD.cages.cards);
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      species: '',
      cageType: '',
      type: 'Normal',
      max:10,
      quantity:10,
    },
    validationSchema: NewCageSchema,
    onSubmit: (values, { setSubmitting }) => {
      createNewCage(values);
      setSubmitting(false);
    },
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
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
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    Create Cage
                  </Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
