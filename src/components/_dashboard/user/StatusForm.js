import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
// material
import {
  Box,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton, MobileTimePicker, TimePicker } from '@material-ui/lab';
// utils
import { species } from '../../../utils/mock-data/species';
import { periodData } from '../../../utils/mock-data/period';
import { status } from '../../../utils/mock-data/status';
import { birdMedicines } from '../../../utils/mock-data/medicine';
// routes
//
import { createFood, getFoodTypeList, getMedicineList } from '../../../redux/slices/food';
import { getBirdType, getSpecieList } from '../../../redux/slices/bird';



// ----------------------------------------------------------------------

StatusForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPlan: PropTypes.object
};

export default function StatusForm({ isEdit, currentPlan }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([{ product: '', quantity: '', error: false }]);
  const [showMedicineFields, setShowMedicineFields] = useState(false);
  const [isCustomNumberOfFeedings, setIsCustomNumberOfFeedings] = useState(false);
  const { birdTypeList, species } = useSelector(state => state.bird);
  const { foodTypeList, medicineList } = useSelector(state => state.food);

  useEffect(() => {
    dispatch(getBirdType());
    dispatch(getSpecieList());
    dispatch(getFoodTypeList());
    dispatch(getMedicineList());

  }, [])


  const { speciesId, periodId } = useParams();
  const FoodPlanSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    species: Yup.string().required('Species is required'),
    period: Yup.string().required('Period is required'),
    status: Yup.string().required('Status is required'),
    products: Yup.array().of(
      Yup.object().shape({
        product: Yup.string().required('Product is required'),
        quantity: Yup.string().required('Quantity is required'),
      })
    ),
    medicines: Yup.array().of(
      Yup.object().shape({
        medicine: Yup.string(),
        dosage: Yup.string(),
      })
    ),
    water: Yup.string().required('Water Amount is required'),
    numberOfFeedings: Yup.number()
      .typeError('Number of Feedings must be a number')
      .positive('Number of Feedings must be positive')
      .integer('Number of Feedings must be an integer')
      .max(100, 'Number of Feedings must not exceed 100')
      .when(['isCustomNumberOfFeedings', 'showMedicineFields'], {
        is: (isCustomNumberOfFeedings, showMedicineFields) =>
          isCustomNumberOfFeedings || showMedicineFields,
        then: Yup.number()
          .required('Number of Feedings is required when custom or for sick birds')
          .min(1, 'Number of Feedings must be at least 1'),
        otherwise: Yup.number().default(1),
      }),
    note: Yup.string().required('Note is required'),
    duration: Yup.number(),
    start: Yup.mixed(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentPlan ? currentPlan.name : '',
      species: currentPlan ? currentPlan.species : '',
      period: currentPlan ? currentPlan.period : '',
      status: currentPlan ? currentPlan.status : '',
      products: currentPlan?.products || [{ product: '', quantity: '', error: false }],
      medicines: currentPlan?.medicines || [{ medicine: '', dosage: '', error: false }],
      water: currentPlan ? 10 : '',
      numberOfFeedings: currentPlan?.numberOfFeedings || 1,
      note: currentPlan?.note || '',
      isCustomNumberOfFeedings: false,
      duration: currentPlan?.duration || '',
      start: currentPlan?.start || ''
    },
    validationSchema: FoodPlanSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {

        // const newProducts = values.products.map((product) => product.product.trim());
        // if (newProducts.some((product) => !product)) {
        //   const updatedProducts = values.products.map((product) => ({
        //     ...product,
        //     error: product.product.trim() === '',
        //   }));
        //   formik.setFieldValue('products', updatedProducts);
        // }

        dispatch(createFood({ ...values, birdTypeList, species, foodTypeList, medicineList, speciesId, periodId }));
        // resetForm();
        // setSubmitting(false);
        // enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.user.list);
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

  const handleAddProductLine = () => {
    const newProduct = { product: '', quantity: '', error: false };
    formik.setFieldValue('products', [...formik.values.products, newProduct]);
  }

  const handleProductChange = (e, index) => {
    const { value } = e.target;
    const newProducts = [...formik.values.products];
    newProducts[index] = { ...newProducts[index], product: value, error: false };
    formik.setFieldValue('products', newProducts);
  };

  const handleQuantityChange = (e, index) => {
    const { value } = e.target;
    const newProducts = [...formik.values.products];
    newProducts[index] = { ...newProducts[index], quantity: value, error: false };
    formik.setFieldValue('products', newProducts);
  };

  const handleDeleteProduct = (index) => {
    const newProducts = [...formik.values.products];
    newProducts.splice(index, 1);
    formik.setFieldValue('products', newProducts);
  }

  const handleAddMedicineLine = () => {
    const newMedicine = { medicine: '', dosage: '', error: false };
    formik.setFieldValue('medicines', [...formik.values.medicines, newMedicine]);
  }

  const handleMedicineChange = (e, index) => {
    const { value } = e.target;
    const selectedMedicine = birdMedicines.find((medicine) => medicine.name === value);
    const dosage = selectedMedicine ? selectedMedicine.dosage : '';
    const newMedicines = [...formik.values.medicines];
    newMedicines[index] = { ...newMedicines[index], medicine: value, dosage, error: false };
    formik.setFieldValue('medicines', newMedicines);
  }

  const handleDeleteMedicine = (index) => {
    const newMedicines = [...formik.values.medicines];
    newMedicines.splice(index, 1);
    formik.setFieldValue('medicines', newMedicines);
  }

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction="column" spacing={2}>

                  <TextField
                    fullWidth
                    label="Name"
                    value={formik.values.name}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Species"
                    {...getFieldProps('species')}
                    error={Boolean(touched.species && errors.species)}
                    helperText={touched.species && errors.species}
                  >{species.map((option) => (
                    <MenuItem key={option.speciesID} value={option.specie}>
                      {option.specie}
                    </MenuItem>
                  ))}</TextField>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Period"
                      {...getFieldProps('period')}
                      error={Boolean(touched.period && errors.period)}
                      helperText={touched.period && errors.period}
                    >
                      {periodData.map((option) => (
                        <MenuItem key={option.periodId} value={option.period}>
                          {option.period}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      {...getFieldProps('status')}
                      error={Boolean(touched.status && errors.status)}
                      helperText={touched.status && errors.status}
                    >
                      {status.map((option) => (
                        <MenuItem key={option.statusId} value={option.status}>
                          {option.status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showMedicineFields}
                          onChange={() => setShowMedicineFields(!showMedicineFields)}
                        />
                      }
                      label="Sick"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isCustomNumberOfFeedings}
                          onChange={() => setIsCustomNumberOfFeedings(!isCustomNumberOfFeedings)}
                        />
                      }
                      label="Birth"
                    />
                  </div>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton onClick={handleAddProductLine} color="primary">
                      Create Product
                    </LoadingButton>
                  </Box>
                  {formik.values.products.map((product, index) => (
                    <Stack key={index} direction="row" spacing={2}>
                      <TextField
                        select
                        fullWidth
                        select
                        label={`Product ${index + 1}`}
                        {...getFieldProps(`products.${index}.product`)}
                        error={product.error}
                        helperText={product.error ? 'Product is required' : ''}
                      >
                        {
                          foodTypeList.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))
                        }
                      </TextField>
                      <TextField
                        fullWidth
                        label="Quantity"
                        disabled={false}
                        {...getFieldProps(`products.${index}.quantity`)}
                        error={product.error && !product.quantity}
                        helperText={product.error && !product.quantity ? 'Quantity is required' : ''}
                        onChange={(e) => handleQuantityChange(e, index)}
                      />
                      <IconButton onClick={() => handleDeleteProduct(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction="column" spacing={2}>
                  {showMedicineFields && (
                    <Stack direction="column" spacing={2}>
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton onClick={handleAddMedicineLine} color="primary">
                          Create Medicine
                        </LoadingButton>
                      </Box>
                      {formik.values.medicines.map((medicine, index) => (
                        <Stack key={index} direction="row" spacing={2}>
                          <TextField
                            select
                            fullWidth
                            label={`Medicine ${index + 1}`}
                            {...getFieldProps(`medicines.${index}.medicine`)}
                            error={medicine.error}
                            helperText={medicine.error ? 'Medicine is required' : ''}
                            onChange={(e) => handleMedicineChange(e, index)}
                          >
                            {birdMedicines.map((option) => (
                              <MenuItem key={option.name} value={option.name}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth
                            label="Dosage"
                            {...getFieldProps(`medicines.${index}.dosage`)}
                            error={medicine.error && !medicine.dosage}
                            helperText={medicine.error && !medicine.dosage ? 'Dosage is required' : ''}
                          />
                          <IconButton onClick={() => handleDeleteMedicine(index)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    label="Water Amount"
                    {...getFieldProps('water')}
                    error={Boolean(touched.water && errors.water)}
                    helperText={touched.water && errors.water}
                  />
                  <TextField
                    fullWidth
                    label="Number of Feedings"
                    type="number"
                    {...getFieldProps('numberOfFeedings')}
                    error={Boolean(touched.numberOfFeedings && errors.numberOfFeedings)}
                    helperText={touched.numberOfFeedings && errors.numberOfFeedings}
                    disabled={!isCustomNumberOfFeedings && !showMedicineFields}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    label="Duration"
                    type="number"
                    disabled={false}
                    {...getFieldProps('duration')}
                    error={Boolean(touched.duration && errors.duration)}
                    helperText={touched.duration && errors.duration}
                  />
                  <TextField
                    fullWidth
                    label="Note"
                    {...getFieldProps('note')}
                    error={Boolean(touched.note && errors.note)}
                    helperText={touched.note && errors.note}
                  />
                </Stack>

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