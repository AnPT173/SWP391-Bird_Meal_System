import MenuItem from '@material-ui/core/MenuItem';
import { Form, FormikProvider, useFormik } from 'formik';
import { merge } from 'lodash';
import { useSnackbar } from 'notistack5';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
// material
import {
  Box,
  Button,
  DialogActions,
  IconButton,
  Stack,
  TextField
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { LoadingButton, MobileDateTimePicker } from '@material-ui/lab';
import { Checkbox } from '@mui/material';
import { useSelector } from 'react-redux';
// redux
import useAuth from '../../../hooks/useAuth';
import { createEvent, updateEvent } from '../../../redux/slices/calendar';
import { useDispatch } from '../../../redux/store';
//
import { getCageList } from '../../../redux/slices/cage';
import { getFoodTypeList, getMedicineList } from '../../../redux/slices/food';
import ColorSinglePicker from '../../ColorSinglePicker';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  { color: '#808080', title: 'Not feeded' }, // statusID: 1
  { color: '#94D82D', title: 'Feeded' }, // statusID: 1
  { color: '#FFC107', title: 'Pending' },// statusID: 2
  { color: '#FF4842', title: 'Feeding Late' }// statusID: 3
];

const STAFFS = [
  { id: '-1', value: '' },
  { id: '2', value: 'Staff 001' },
  { id: '3', value: 'Staff 002' },
  { id: '4', value: 'Staff 003' },
  { id: '5', value: 'Staff 004' }
];


const FEEDING_NOTE = [
  { id: '-1', value: '' },
  { id: 'FN001', value: 'Normal' },
  { id: 'FN002', value: 'Sick' },
  { id: 'FN003', value: 'Bird' }
];
const STATUS = [
  { id: '-1', value: '' },
  { id: 'ST001', value: 'Pending' },
  { id: 'ST002', value: 'Feeded' },
  { id: 'ST003', value: 'Late' }
];
const getInitialValues = (event, range) => {
  const _event = {
    title: '',
    description: '',
    cageId: [],
    staffId: '',
    medicines: [{ id: '', name: '', dose: '', error: false }],
    foods: [{ id: '', name: '', quantity: '', error: false }],
    status: '',
    textColor: '',
    start: '',
    feedingRegimen: '',
    water: '',
    feedingTime: ''
  };

  if (event || range) {
    return merge({}, _event, event);
  }

  return _event;
};

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func
};

export default function CalendarForm({ event, isCreating, range, onCancel }) {
console.log('event', event);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [currentEvent, setCurrentEvent] = useState([]);
  const { cageList } = useSelector(state => state.cage);
  const { foodTypeList, medicineList } = useSelector(state => state.food);
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(getCageList());
    dispatch(getFoodTypeList());
    dispatch(getMedicineList());
  }, []);

  const isManager = user?.role === 'manager';

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255),
    description: Yup.string().max(5000),
    status: Yup.string(),
    feedingRegimen: Yup.string(),
    start: Yup.date(),
    feedingTime: Yup.date()
  });

  const formik = useFormik({
    initialValues: getInitialValues(event, range),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const newEvent = {
          title: values.title ?? '',
          description: values.description ?? '',
          cageId: values.cageId ?? [],
          staffId: values.staffId ?? '',
          medicines: values.medicines ?? [],
          foods: values.foods ?? [],
          status: values.status ?? '',
          textColor: values.textColor ?? '',
          start: values.start ?? '',
          feedingRegimen: values.feedingRegimen ?? '',
          feedingTime: values.feedingTime ?? ''
        };
        if (isCreating) {
          dispatch(createEvent(values, foodTypeList, medicineList));
          enqueueSnackbar('Create event success', { variant: 'success' });
        } else {
          console.log("update..")
          dispatch(updateEvent(values.id, values))
          enqueueSnackbar('Update event success', { variant: 'success' });
        }
        resetForm();
        onCancel();
        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  console.log('values', errors);
  const handleAddCage = (e) => {

  }
  // console.log('error', values)
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Title"
            {...getFieldProps('title')}
            disabled={!isManager || values.status === 'completed'}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
          />

          <TextField
            fullWidth
            multiline
            maxRows={4}
            label="Description"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />
          {isCreating && <Stack direction="column" spacing={2}>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton onClick={() => setFieldValue('foods', [...values.foods, { id: '', name: '', quantity: '', error: false }])} color="primary">
                Add Food
              </LoadingButton>
            </Box>

           {formik.values.foods.map((food, index) => (
            <Stack key={index} direction="row" spacing={2}>
              <TextField
                fullWidth
                select
                label={`Food Type ${index + 1}`}
                value={values.foods[index]?.id}
                error={food.error}
                helperText={food.error ? 'Food is required' : ''}
                onChange={(e) => {
                  const foodId = e.target.value;
                  const selectedFood = foodTypeList.find(i => i.id === +foodId);
                  setFieldValue('foods', values.foods.map((f, i) => i === index ? { ...f, id: foodId, name: selectedFood?.name } : f));
                }
                }
              >
                {foodTypeList.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Quantity"
                disabled={false}
                value={values.foods[index]?.quantity}
                error={food.error && !food.quantity}
                helperText={food.error && !food.quantity ? 'Quantity is required' : ''}
                onChange={(e) => setFieldValue('foods', formik.values.foods.map((f, i) => i === index ? { ...f, quantity: e.target.value } : f))}
              />
              <IconButton onClick={() => setFieldValue('foods', values.foods.toSpliced(index, 1))} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
            ))}
          </Stack>}

          {/* View Schedule */}

          {!isCreating && <Stack direction="column" spacing={2}>
            
           {formik.values.foods.map((food, index) => (
            <Stack key={index} direction="row" spacing={2}>
              <TextField
                fullWidth
                disabled
                label={`Food Type ${index + 1}`}
                value={food?.foodTypeID?.name}
              />
              <TextField
                fullWidth
                label="Quantity"
                disabled
                value={food?.quantity}
              />
            </Stack>
            ))}
          </Stack>}
          {isCreating &&
            <Stack direction="column" spacing={2}>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton onClick={() => setFieldValue('medicines', [...values.medicines, { medicine: '', dosage: '', error: false }])} color="primary">
                  Add Medicine
                </LoadingButton>
              </Box>
              {formik.values.medicines.map((medicine, index) => (
                <Stack key={index} direction="row" spacing={2}>
                  <TextField
                    select
                    fullWidth
                    label={`Medicine ${index + 1}`}
                    value={values?.medicines[index]?.id}
                    error={medicine?.error}
                    helperText={medicine?.error ? 'Medicine is required' : ''}
                    onChange={(e) => {
                      const medicineId = e.target.value;
                      const selectedMedicine = medicineList.find(i => i.id === +medicineId);
                      setFieldValue('medicines', values.medicines.map((m, i) => i === index ? { ...m, id: medicineId, name: selectedMedicine?.name } : m));

                    }}
                  >
                    {medicineList.map((option) => (
                      <MenuItem key={option.name} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Dosage"
                    value={values.medicines[index]?.dosage}
                    error={medicine.error && !medicine.dosage}
                    helperText={medicine.error && !medicine.dosage ? 'Dosage is required' : ''}
                    onChange={(e) => setFieldValue('medicines', values.medicines.map((p, i) => i === index ? { ...p, dose: e.target.value } : p))}
                  />
                  <IconButton onClick={() => setFieldValue('medicines', values.medicines.toSpliced(index, 1))} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          }
          {/* View Medicine */}
          {!isCreating &&
            <Stack direction="column" spacing={2}>
             {formik.values.medicines.map((medicine, index) => (
                <Stack key={index} direction="row" spacing={2}>
                  <TextField
                    disabled
                    fullWidth
                    label={`Medicine ${index + 1}`}
                    value={medicine?.medicineID?.name}
                  />
                  <TextField
                    fullWidth
                    label="Dosage"
                    value={medicine?.quantity}
                    disabled
                  />
                </Stack>
              ))}
            </Stack>
          }

          <Stack direction="row" spacing={1.0}>
            {!isCreating &&
              <TextField
                disabled
                value={values.staffId.accountName}
                fullWidth
                label="Staff"
              />}
            <TextField
              disabled={!isCreating}
              // value={values.staffId.accountName}
              value={isCreating ? values.water : 10}
              fullWidth
              label="Water"
            />

            {!isCreating &&
              <TextField
                disabled
                value={values.cageId}
                fullWidth
                label="Cage ID"
              />}

            {isCreating &&
              <TextField
                select
                {...getFieldProps('staffId')}
                value={values.staffId}
                fullWidth
                label="Staff"
                disabled={!isManager || values?.status === 'completed'}
                error={Boolean(touched.staffId && errors.staffId)}
                helperText={touched.staffId && errors.staffId}
                SelectProps={{ native: true }}
              >
                {STAFFS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.value}
                  </option>
                ))}
              </TextField>}


          </Stack>
          <Stack direction="row" spacing={1.0}>

            {isCreating && cageList.map((cage) => (
              <>
                <p>
                  {`Cage ${cage.id}`}
                  <Checkbox value={cage.id} onChange={(e, checked) => {
                    if (checked) { setFieldValue('cageId', [...values.cageId, e.target.value]) }
                    else { setFieldValue('cageId', values.cageId.filter(i => i !== e.target.value)) }
                  }} />
                </p>
              </>
            ))}

          </Stack>

          <Stack direction="row" spacing={1.0}>
            <TextField
              select
              {...getFieldProps('feedingRegimen')}
              value={values.feedingRegimen}
              fullWidth
              label="Feeding Regimen"
              error={Boolean(touched.feedingRegimen && errors.feedingRegimen)}
              helperText={touched.feedingRegimen && errors.feedingRegimen}
              SelectProps={{ native: true }}
            >
              {FEEDING_NOTE.map((f) => (
                <option key={f.id} value={f.value}>
                  {f.value}
                </option>
              ))}
            </TextField>

            {!isCreating && (
              <MobileDateTimePicker
                label="Feeding time"
                value={values.end}
                inputFormat="yyyy-mm-dd hh:mm"
                onChange={(date) => setFieldValue('feedingTime', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={Boolean(touched.end && errors.end)}
                    helperText={touched.end && errors.end}
                    sx={{ mb: 3 }}
                  />
                )}
              />
            )}
          </Stack>

          {isCreating && (
            <MobileDateTimePicker
              label="Start date"
              value={values.start}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(date) => setFieldValue('start', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}


         {!isCreating && <ColorSinglePicker
            {...getFieldProps('textColor')}
            colors={COLOR_OPTIONS}
            onChange={(e)=>setFieldValue('textColor', e.target.value)}
          />
}
        </Stack>

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            {isCreating ? 'Add' : 'Update'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
