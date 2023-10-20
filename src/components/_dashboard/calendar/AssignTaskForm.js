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
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
//
import ColorSinglePicker from '../../ColorSinglePicker';
import Label from '../../Label';
import Typography from '../../../theme/overrides/Typography';

// ----------------------------------------------------------------------


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

AssignTaskForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func
};

export default function AssignTaskForm({ event, range, onCancel }) {

  // const { enqueueSnackbar } = useSnackbar();
  // const dispatch = useDispatch();
  // const isCreating = !event;
  // // id: '003',
  // //   cageId: 'CA002',
  // //   title: 'Feed Bird',
  // //   description: 'Feeding for CA002',
  // //   foodType: 'Product 1',
  // //   start: sub(new Date(), { days: 1, hours: 0, minutes: 45 }),
  // //   end: sub(new Date(), { days: 1, hours: 0, minutes: 35 }),
  // //   foodQuantity: '90 grams',
  // //   staffId: 'STA002',
  // //   status: 'Completed',
  // //   textColor: COLOR_OPTIONS[2]

  // const EventSchema = Yup.object().shape({
  //   title: Yup.string().max(255).required('Title is required'),
  //   description: Yup.string().max(5000),
  //   cageId: Yup.string(),
  //   foodtype: Yup.string(),
  //   foodQuantity: Yup.string(),
  //   staffId: Yup.string(),
  //   status: Yup.string(),
  //   feedingRegimen: Yup.string(),
  //   end: Yup.date().when(
  //     'start',
  //     (start, schema) => start && schema.min(start, 'End date must be later than start date')
  //   ),
  //   start: Yup.date(),
  //   feedingTime: Yup.date()
  // });
  // const formik = useFormik({
  //   initialValues: getInitialValues(event, range),
  //   validationSchema: EventSchema,
  //   onSubmit: async (values, { resetForm, setSubmitting }) => {
  //     try {
  //       const newEvent = {
  //         title: values.title,
  //         description: values.description,
  //         foodtype: values.foodtype,
  //         cageID: values.cageID,
  //         feedingregimen: values.feedingregimen,
  //         medicine: values.medicine,
  //         foodQuantity: values.foodQuantity,
  //         staffId: values.staffId,
  //         status: values.status,
  //         textColor: values.textColor,
  //         allDay: values.allDay,
  //         start: values.start,
  //         end: values.end,
  //         feedingRegimen: values.feedingRegimen,
  //         feedingTime: values.feedingTime
  //       };
  //       if (event) {
  //         dispatch(updateEvent(event.id, newEvent));
  //         enqueueSnackbar('Update event success', { variant: 'success' });
  //       } else {
  //         dispatch(createEvent(newEvent));
  //         enqueueSnackbar('Create event success', { variant: 'success' });
  //       }
  //       resetForm();
  //       onCancel();
  //       setSubmitting(false);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // });

  // const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  const staff = [
    { id: 1, value: 'STA001' },
    { id: 2, value: 'STA002' },
    { id: 3, value: 'STA003' },
  ]
  return (
    <FormikProvider >
      {/* <Form autoComplete="off" noValidate > */}
      <Stack spacing={3} style={{'margin': '10px'}}>

        <TextField
          fullWidth
          label='Location Id'
          value='L001'
          disabled
        />

        <TextField
          select
          fullWidth
          label='Assign to'
          SelectProps={{ native: true }}
        >
          {staff.map((s) => (
            <option key={s.id} value={s.value}>
              {s.value}
            </option>
          ))}
        </TextField>
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button type="button" variant="outlined" color="inherit" >
          Cancel
        </Button>
        <LoadingButton type="submit" variant="contained" >
          Update
        </LoadingButton>
      </DialogActions>
      {/* </Form> */}
    </FormikProvider>
  );
}
