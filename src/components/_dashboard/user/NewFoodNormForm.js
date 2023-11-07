import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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
import { LoadingButton, MobileTimePicker } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
// routes
//
import { getBirdType, getSpecieList } from '../../../redux/slices/bird';
import { createFood, getFoodList, getFoodTypeList, getMedicineList } from '../../../redux/slices/food';
import { PATH_DASHBOARD } from '../../../routes/paths';
import foodPlanData from '../../../utils/mock-data/foodPlan';


// ----------------------------------------------------------------------

NewFoodNormForm.propTypes = {
  isEdit: PropTypes.bool
};

export default function NewFoodNormForm({ isEdit }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [currentPlan, setCurrentFoodPlan] = useState();
  const [products, setProducts] = useState([{ product: '', quantity: '', error: false }]);
  const [showMedicineFields, setShowMedicineFields] = useState(false);
  const [isCustomNumberOfFeedings, setIsCustomNumberOfFeedings] = useState(false);
  const { birdTypeList, species } = useSelector(state => state.bird);
  const { foodList, foodTypeList, medicineList } = useSelector(state => state.food);

  useEffect(() => {
    dispatch(getBirdType());
    dispatch(getSpecieList());
    dispatch(getFoodList());
    dispatch(getFoodTypeList());
    dispatch(getMedicineList());
  }, [])

  // console.log('current food plan', currentFoodPlan)

  const FoodPlanSchema = Yup.object().shape({

    water: Yup.string().required('Water Amount is required'),
    numberOfFeedings: Yup.number()
      .typeError('Number of Feedings must be a number')
      .positive('Number of Feedings must be positive')
      .integer('Number of Feedings must be an integer')
      .max(100, 'Number of Feedings must not exceed 100')
      .when('isCustomNumberOfFeedings', {
        is: true,
        then: Yup.number()
          .required('Number of Feedings is required when custom')
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
      foods: currentPlan?.foods ?? [],
      medicines: currentPlan?.medicines ?? [],
      water: currentPlan ? 10 : '',
      numberOfFeedings: currentPlan?.numberOfFeedings || 1,
      note: currentPlan?.note ?? '',
      isCustomNumberOfFeedings: false,
      duration: currentPlan?.duration ?? '',
      start: currentPlan?.start ?? ''
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

        dispatch(createFood({ ...values, currentPlan, birdTypeList, species, foodTypeList, medicineList, speciesId: id }));
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.food.card);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { values, errors, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;


  
  useEffect(() => {
    // get current food plan from mock data
    const data = foodPlanData.find(i => i.id === +id)
    const { specieId, status } = data;
    // const currentFoodPlan = foodList ? foodList.find(i => i?.id === 16) : null;
    const currentFoodPlan = foodList ? foodList.find( i => i?.birdTypeid?.name === status && i?.birdTypeid?.specieid?.id === specieId) : null;
    console.log('current food plan', currentFoodPlan)
    if (currentFoodPlan) {
      const { duration, foodnormFoods, foodnormMedicines,note,numberOfFeeding, startTime } = currentFoodPlan;
      console.log(foodnormFoods, foodnormMedicines);
      setFieldValue('foods', foodnormFoods);
      setFieldValue('medicines', foodnormMedicines);
      setFieldValue('note', note);
      setFieldValue('numberOfFeeding', numberOfFeeding);
      setShowMedicineFields(foodnormMedicines.length > 0);
      setFieldValue('start', startTime);
      setFieldValue('duration', duration);

      data.foods = foodnormFoods;
      data.medicines = foodnormMedicines;
    }

    setCurrentFoodPlan(data);
  }, [foodList])

  console.log('current plan', currentPlan)
  console.log("values", values);
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction="column" spacing={2}>
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
                    <LoadingButton onClick={() => setFieldValue('foods', [...values.foods, { id: '', name: '', quantity: '', error: false }])} color="primary">
                      Add Product
                    </LoadingButton>
                  </Box>
                  {formik.values.foods.map((product, index) => (
                    <Stack key={index} direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        select
                        label={`Product ${index + 1}`}
                        error={product.error}
                        helperText={product.error ? 'Product is required' : ''}
                        onChange={(e) => {
                          const foodId = e.target.value;
                          const selectedFood = foodTypeList.find(i => i.id === +foodId);
                          setFieldValue('foods', values.foods.map((f, i) => i === index ? { ...f, id: foodId, name: selectedFood?.name , foodTypeID:{...selectedFood}, foodType:{...selectedFood}} : f));
                        }}
                        value={values?.foods[index]?.foodTypeID?.id}
                      >
                        {
                          foodTypeList.map(option => (
                            <MenuItem key={option.id} value={option.id}
                              selected={option.id === values?.foods[index]?.foodTypeID?.id}
                            >
                              {option.name}
                            </MenuItem>
                          ))
                        }
                      </TextField>
                      <TextField
                        fullWidth
                        label="Quantity"
                        disabled={false}
                        value={values.foods[index]?.quantity}
                        error={product.error && !product.quantity}
                        helperText={product.error && !product.quantity ? 'Quantity is required' : ''}
                        onChange={(e) => setFieldValue('foods', formik.values.foods.map((f, i) => i === index ? { ...f, quantity: e.target.value } : f))}
                      />
                      <IconButton onClick={() => setFieldValue('foods', values.foods.toSpliced(index, 1))} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction="column" spacing={2}>
                  {showMedicineFields && (
                    <Stack direction="column" spacing={2}>
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton onClick={() => setFieldValue('medicines', [...values.medicines, { medicine: '', quantity: '', error: false }])} color="primary">
                          Add Medicine
                        </LoadingButton>
                      </Box>
                      {formik.values.medicines.map((medicine, index) => (
                        <Stack key={index} direction="row" spacing={2}>
                          <TextField
                            select
                            fullWidth
                            label={`Medicine ${index + 1}`}
                            error={medicine.error}
                            helperText={medicine.error ? 'Medicine is required' : ''}
                            onChange={(e) => {
                              const medicineId = e.target.value;
                              const selectedMedicine = medicineList.find(i => i.id === +medicineId);
                              console.log('selected me', selectedMedicine)
                              setFieldValue('medicines', values.medicines.map((m, i) => i === index ? { ...m, id: medicineId, name: selectedMedicine?.name, medicineID: {...selectedMedicine} } : m));
                              
                            }}
                            value={values?.medicines[index]?.medicineID?.id}
                          >
                            {medicineList.map((option) => (
                              <MenuItem key={option.id} value={option.id} selected={option.id === values?.medicines[index]?.medicineID?.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth
                            label="Dosage"
                            value={values.medicines[index]?.quantity}
                            onChange={(e) => setFieldValue('medicines', values.medicines.map((p, i) => i === index ? { ...p, quantity: e.target.value } : p))}
                            error={medicine.error && !medicine.quantity}
                            helperText={medicine.error && !medicine.quantity ? 'Dosage is required' : ''}
                          />
                          <IconButton onClick={() => setFieldValue('medicines', values.medicines.toSpliced(index, 1))} color="error">
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
                    disabled={!isCustomNumberOfFeedings}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <MobileTimePicker
                    orientation="portrait"
                    label="Time of feeding"
                    value={values.start}
                    onChange={(newValue) => {
                      setFieldValue('start', newValue);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                  <TextField
                    fullWidth
                    label="Duration (h)"
                    type="number"
                    disabled={false}
                    {...getFieldProps('duration')}
                    error={Boolean(touched.duration && errors.duration)}
                    helperText={touched.duration && errors.duration}
                  />

                </Stack>
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

