import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import * as Yup from 'yup';
import { merge } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Box,
  Stack,
  Button,
  Switch,
  Tooltip,
  TextField,
  IconButton,
  DialogActions,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton, MobileDateTimePicker } from '@material-ui/lab';
// redux
import useAuth from '../../../hooks/useAuth';
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
//
import ColorSinglePicker from '../../ColorSinglePicker';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#94D82D', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E' // theme.palette.error.darker
];

const PRODUCTS = [
  { id: 'P001', value: 'Product 01' },
  { id: 'P002', value: 'Product 02' },
  { id: 'P003', value: 'Product 03' },
  { id: 'P004', value: 'Product 04' }
];

const STAFFS = [
  { id: 'STA001', value: 'Staff 001' },
  { id: 'STA002', value: 'Staff 002' },
  { id: 'STA003', value: 'Staff 003' },
  { id: 'STA004', value: 'Staff 004' }
];
const CAGES = [
  { id: 'CA001', value: 'Cage 001' },
  { id: 'CA002', value: 'Cage 002' },
  { id: 'CA003', value: 'Cage 003' },
  { id: 'CA004', value: 'Cage 004' },
  { id: 'CA005', value: 'Cage 005' }
];
const FOODS = [
  { id: 'FO001', value: 'Food 1' },
  { id: 'FO002', value: 'Food 2' },
  { id: 'FO003', value: 'Food 3' },
  { id: 'FO004', value: 'Food 4' }
];

const FEEDING_NOTE = [
  { id: 'FN001', value: 'Normal' },
  { id: 'FN002', value: 'Sick' },
  { id: 'FN003', value: 'Bird' }
];
const getInitialValues = (event, range) => {
  const _event = {
    title: '',
    description: '',
    foodtype: '',
    cageID: '',
    feedingregimen: '',
    medicine: '',
    textColor: '#1890FF',
    allDay: false,
    start: range ? new Date(range.start) : new Date(),
    country: '',
    end: range ? new Date(range.end) : new Date()
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

export default function CalendarForm({ event, range, onCancel }) {
  console.log('event', event);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isCreating = !event;
  const isManager = user?.role === 'manager';
  // id: '003',
  //   cageId: 'CA002',
  //   title: 'Feed Bird',
  //   description: 'Feeding for CA002',
  //   foodType: 'Product 1',
  //   start: sub(new Date(), { days: 1, hours: 0, minutes: 45 }),
  //   end: sub(new Date(), { days: 1, hours: 0, minutes: 35 }),
  //   foodQuantity: '90 grams',
  //   staffId: 'STA002',
  //   status: 'Completed',
  //   textColor: COLOR_OPTIONS[2]

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
    cageId: Yup.string(),
    foodtype: Yup.string(),
    foodQuantity: Yup.string(),
    staffId: Yup.string(),
    status: Yup.string(),
    feedingRegimen: Yup.string(),
    end: Yup.date().when(
      'start',
      (start, schema) => start && schema.min(start, 'End date must be later than start date')
    ),
    start: Yup.date(),
    feedingTime: Yup.date()
  });
  const formik = useFormik({
    initialValues: getInitialValues(event, range),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const newEvent = {
          title: values.title,
          description: values.description,
          foodtype: values.foodtype,
          cageID: values.cageID,
          feedingregimen: values.feedingregimen,
          medicine: values.medicine,
          foodQuantity: values.foodQuantity,
          staffId: values.staffId,
          status: values.status,
          textColor: values.textColor,
          allDay: values.allDay,
          start: values.start,
          end: values.end,
          feedingRegimen: values.feedingRegimen,
          feedingTime: values.feedingTime
        };
        if (event) {
          dispatch(updateEvent(event.id, newEvent));
          enqueueSnackbar('Update event success', { variant: 'success' });
        } else {
          dispatch(createEvent(newEvent));
          enqueueSnackbar('Create event success', { variant: 'success' });
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
  console.log('values', values);
  const handleDelete = async () => {
    try {
      onCancel();
      dispatch(deleteEvent(event.id));
      enqueueSnackbar('Delete event success', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Title"
            {...getFieldProps('title')}
            disabled={!isManager || values?.status === 'completed'}
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
          <TextField
            select
            {...getFieldProps('foodType')}
            value={values.foodtype}
            fullWidth
            label="Food Type"
            disabled={!isManager || values?.status === 'completed'}
            error={Boolean(touched.foodtype && errors.foodtype)}
            helperText={touched.foodtype && errors.foodtype}
            SelectProps={{ native: true }}
          >
            {FOODS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.value}
              </option>
            ))}
          </TextField>

          <TextField
            select
            {...getFieldProps('cageId')}
            value={values.cageID}
            fullWidth
            label="Cage ID"
            disabled={!isManager || values?.status === 'completed'}
            error={Boolean(touched.cageID && errors.cageID)}
            helperText={touched.cageID && errors.cageID}
            SelectProps={{ native: true }}
          >
            {CAGES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.value}
              </option>
            ))}
          </TextField>

          <TextField
            select
            {...getFieldProps('staffId')}
            value={values.cageID}
            fullWidth
            label="Staff ID"
            disabled={!isManager || values?.status === 'completed'}
            error={Boolean(touched.cageID && errors.cageID)}
            helperText={touched.cageID && errors.cageID}
            SelectProps={{ native: true }}
          >
            {STAFFS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.value}
              </option>
            ))}
          </TextField>
          <TextField
            select
            {...getFieldProps('feedingRegimen')}
            value={values.feedingregimen}
            fullWidth
            label="Feeding Regimen"
            error={Boolean(touched.feedingregimen && errors.feedingregimen)}
            helperText={touched.feedingregimen && errors.feedingregimen}
            SelectProps={{ native: true }}
          >
            {FEEDING_NOTE.map((f) => (
              <option key={f.id} value={f.id}>
                {f.value}
              </option>
            ))}
          </TextField>
          {/* <TextField
            select
            {...getFieldProps('medicine')}
            fullWidth
            label="Medicine"
            error={Boolean(touched.medicine && errors.medicine)}
            helperText={touched.medicine && errors.medicine}
          >
            <MenuItem value="option 0">None</MenuItem>
            <MenuItem value="option 1">Medicine 1</MenuItem>
            <MenuItem value="option 2">Medicine 2</MenuItem>
            <MenuItem value="option 3">Medicine 3</MenuItem>
          </TextField> */}


          {/* <FormControlLabel control={<Switch checked={values.allDay} {...getFieldProps('allDay')} />} label="All day" /> */}

           {isCreating && <MobileDateTimePicker
            label="Start date"
            value={values.start}
            inputFormat="dd/MM/yyyy hh:mm a"
            onChange={(date) => setFieldValue('start', date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />}

          {isCreating && <MobileDateTimePicker
            label="End date"
            value={values.end}
            inputFormat="dd/MM/yyyy hh:mm a"
            onChange={(date) => setFieldValue('end', date)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={Boolean(touched.end && errors.end)}
                helperText={touched.end && errors.end}
                sx={{ mb: 3 }}
              />
            )}
          />}

          {!isCreating && <MobileDateTimePicker
            label="Feeding time"
            value={values.end}
            inputFormat="dd/MM/yyyy hh:mm a"
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
          />}

          {isCreating && <ColorSinglePicker {...getFieldProps('textColor')} colors={COLOR_OPTIONS} />}
        </Stack>

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            {isCreating ? "Add" : "Update"}
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
