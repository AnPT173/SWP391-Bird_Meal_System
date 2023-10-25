import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
// material
import {
    Box,
    Button,
    DialogActions,
    DialogTitle,
    Stack,
    TextField
} from '@material-ui/core';
import { LoadingButton, MobileDateTimePicker } from '@material-ui/lab';
// redux
import { createEvent, openCreateMultipleTaskDialog } from '../../../redux/slices/calendar';
import { useDispatch } from '../../../redux/store';
//

// ----------------------------------------------------------------------


export default function CreateMultipleTaskDialog() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { selectedRange } = useSelector(state => state.calendar)
    const EventSchema = Yup.object().shape({
        fromDate: Yup.date(),
        endDate: Yup.date()
    });

    const formik = useFormik({
        initialValues: {
            fromDate: selectedRange?.start ?? '',
            toDate: selectedRange?.end ?? ''
        },
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                dispatch(createEvent(values));
                enqueueSnackbar('Create event success', { variant: 'success' });
                resetForm();
                dispatch(openCreateMultipleTaskDialog());
                setSubmitting(false);
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { values, handleSubmit, isSubmitting, setFieldValue } = formik;

 
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <DialogTitle>Create batch events</DialogTitle>
                <Stack spacing={3} sx={{ p: 3 }}>

                    <MobileDateTimePicker
                        label="From Date"
                        value={values.fromDate}
                        inputFormat="dd/MM/yyyy hh:mm a"
                        onChange={(date) => setFieldValue('fromDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth />} />
                    <MobileDateTimePicker
                        label="To Date"
                        value={values.toDate}
                        inputFormat="dd/MM/yyyy hh:mm a"
                        onChange={(date) => setFieldValue('toDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Stack>

                <DialogActions>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button type="button" variant="outlined" color="inherit" onClick={() => dispatch(openCreateMultipleTaskDialog())}>
                        Cancel
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
                        Create
                    </LoadingButton>
                </DialogActions>
            </Form>
        </FormikProvider >
    );
}