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
import { useSelector } from 'react-redux';
// redux
import useAuth from '../../../hooks/useAuth';
import { createEvent, updateEvent } from '../../../redux/slices/calendar';
import { useDispatch } from '../../../redux/store';
//
import { getCageList } from '../../../redux/slices/cage';
import { getFoodList, getFoodTypeList, getMedicineList } from '../../../redux/slices/food';
import ColorSinglePicker from '../../ColorSinglePicker';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  { color: '#94D82D', title: 'Feeded' },
  { color: '#FFC107', title: 'Pending' },
  { color: '#FF4842', title: 'Feeding Late' }
];

const STAFFS = [
  { id: '-1', value: '' },
  { id: '1', value: 'Staff 001' },
  { id: '2', value: 'Staff 002' },
  { id: '3', value: 'Staff 003' },
  { id: '4', value: 'Staff 004' }
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
    cageId: '',
    staffId: '',
    medicines: [{ id: '', name: '', dose: '', error: false }],
    foods: [{ id: '', name: '', quantity: '', error: false }],
    status: '',
    textColor: '',
    start: '',
    feedingRegimen: '',
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
    cageId: Yup.string(),
    staffId: Yup.string(),
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
          cageId: values.cageId ?? '',
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
          dispatch(createEvent(values));
          enqueueSnackbar('Create event success', { variant: 'success' });
        } else {
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

  console.log('error', values)
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
                  setFieldValue('foods', values.foods.map((f, i) => i === index ? { ...f, id: foodId, name: selectedFood?.name} : f));
                }
              }
              >
{                foodTypeList.map(option => (
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
                  value={values.medicine[index]?.id}
                  error={medicine.error}
                  helperText={medicine.error ? 'Medicine is required' : ''}
                  onChange={(e) => setFieldValue('medicines', values.medicines.map((p, i) => i === index ? { ...p, name: e.target.value } : p))}
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
                  value={values.medicine[index]?.dosage}
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

          <Stack direction="row" spacing={1.0}>

            {isCreating &&
              <TextField
                select
                {...getFieldProps('cageId')}
                value={values.cageId}
                fullWidth
                label="Cage ID"
                disabled={!isManager || values?.status === 'completed'}
                error={Boolean(touched.cageId && errors.cageId)}
                helperText={touched.cageId && errors.cageId}
                SelectProps={{ native: true }}
              >
                {cageList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {`Cage ${c.id}`}
                  </option>
                ))}
              </TextField>}


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
                label="Staff ID"
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

            {!isCreating &&
              <TextField
                disabled
                value={values.staffId}
                fullWidth
                label="Staff ID"
              />}
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
                <option key={f.id} value={f.id}>
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


          <ColorSinglePicker
            {...getFieldProps('textColor')}
            colors={COLOR_OPTIONS}
          />

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
