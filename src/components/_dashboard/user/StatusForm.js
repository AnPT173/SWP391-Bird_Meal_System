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
import { LoadingButton } from '@material-ui/lab';
// utils
import { birdMedicines } from '../../../utils/mock-data/medicine';
// routes
//
import { createFood } from '../../../redux/slices/food';
import { getBirdType } from '../../../redux/slices/bird';



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

  useEffect(() => {
    dispatch(getBirdType());
  })


  const { speciesId, periodId } = useParams();
  const FoodPlanSchema = Yup.object().shape({
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
      .when('isCustomNumberOfFeedings', {
        is: true,
        then: Yup.number()
          .required('Number of Feedings is required when custom')
          .min(1, 'Number of Feedings must be at least 1'),
        otherwise: Yup.number().default(1),
      }),
    note: Yup.string().required('Note is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      products: currentPlan?.products || [{ product: '', quantity: '', error: false }],
      medicines: currentPlan?.medicines || [{ medicine: '', dosage: '', error: false }],
      water: currentPlan?.water || '',
      numberOfFeedings: currentPlan?.numberOfFeedings || 1,
      note: currentPlan?.note || '',
      isCustomNumberOfFeedings: false,
    },
    validationSchema: FoodPlanSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const newProducts = values.products.map((product) => product.product.trim());
        if (newProducts.some((product) => !product)) {
          const updatedProducts = values.products.map((product) => ({
            ...product,
            error: product.product.trim() === '',
          }));
          formik.setFieldValue('products', updatedProducts);
          setSubmitting(false);
          return;
        }

        dispatch(createFood({ ...values }, birdTypeList, species ,speciesId, periodId));
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

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

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
  };

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
  };

  const handleAddMedicineLine = () => {
    const newMedicine = { medicine: '', dosage: '', error: false };
    formik.setFieldValue('medicines', [...formik.values.medicines, newMedicine]);
  };

  const handleMedicineChange = (e, index) => {
    const { value } = e.target;
    const selectedMedicine = birdMedicines.find((medicine) => medicine.name === value);
    const dosage = selectedMedicine ? selectedMedicine.dosage : '';
    const newMedicines = [...formik.values.medicines];
    newMedicines[index] = { ...newMedicines[index], medicine: value, dosage, error: false };
    formik.setFieldValue('medicines', newMedicines);
  };

  const handleDeleteMedicine = (index) => {
    const newMedicines = [...formik.values.medicines];
    newMedicines.splice(index, 1);
    formik.setFieldValue('medicines', newMedicines);
  };

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
                    <LoadingButton onClick={handleAddProductLine} color="primary">
                      Create Product
                    </LoadingButton>
                  </Box>
                  {formik.values.products.map((product, index) => (
                    <Stack key={index} direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label={`Product ${index + 1}`}
                        {...getFieldProps(`products.${index}.product`)}
                        error={product.error}
                        helperText={product.error ? 'Product is required' : ''}
                      />
                      <TextField
                        fullWidth
                        label="Quantity"
                        {...getFieldProps(`products.${index}.quantity`)}
                        error={product.error && !product.quantity}
                        helperText={product.error && !product.quantity ? 'Quantity is required' : ''}
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
                    disabled={!isCustomNumberOfFeedings}
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

