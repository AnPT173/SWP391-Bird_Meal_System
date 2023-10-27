import React, { useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { title } from '../../../utils/mock-data/text';
// redux
import useAuth from '../../../hooks/useAuth';
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
//
import ColorSinglePicker from '../../ColorSinglePicker';
import { getSchedule, saveSchedule } from '../../../utils/mock-data/localStorageUtil';
import { getCageList } from '../../../redux/slices/cage';
import { getFoodList } from '../../../redux/slices/food';

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
    status: '',
    title: '',
    description: '',
    foodType: '',
    cageId: '',
    staffId: '',
    feedingRegimen: '',
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

export default function CalendarForm({ event, isCreating, range, onCancel }) {

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [currentEvent, setCurrentEvent] = useState([]);
  const { cageList } = useSelector(state => state.cage);
  const { foodList } = useSelector(state => state.food);
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(getCageList());
    dispatch(getFoodList());
  }, []);

  const isManager = user?.role === 'manager';

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
    cageId: Yup.string(),
    foodType: Yup.string(),
    foodQuantity: Yup.string(),
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
          foodType: values.foodType ?? '',
          cageId: values.cageId ?? '',
          staffId: values.staffId ?? '',
          medicine: values.medicine ?? '',
          foodQuantity: values.foodQuantity ?? '',
          status: values.status ?? '',
          textColor: values.textColor ?? '',
          allDay: values.allDay ?? '',
          start: values.start ?? '',
          feedingRegimen: values.feedingRegimen ?? '',
          feedingTime: values.feedingTime ?? ''
        };
        if (isCreating) {
          dispatch(createEvent(values));
          enqueueSnackbar('Create event success', { variant: 'success' });
        } else {
          await saveSchedule([...currentEvent, values]);
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

  console.log("vvv", values)
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
          <Stack direction="row" spacing={1.0}>
            <TextField
              select
              {...getFieldProps('foodType')}
              value={values.foodType}
              fullWidth
              label="Food Type"
              disabled={!isManager || values?.status === 'completed'}
              error={Boolean(touched.foodType && errors.foodType)}
              helperText={touched.foodType && errors.foodType}
              SelectProps={{ native: true }}
            >
              {foodList.map((f) => (
                <option key={f.id} value={f.id}>
                  {`Food Norm ${f.id}`}
                </option>
              ))}
            </TextField>

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
            </TextField>

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
            </TextField>
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
