import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
// material
import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogTitle,
    Grid,
    Stack,
    TextField
} from '@material-ui/core';
import { LoadingButton, MobileDateTimePicker } from '@material-ui/lab';
// redux
import { getCageList } from '../../../../redux/slices/cage';
import { createMultipleEvent, openCreateMultipleTaskDialog } from '../../../../redux/slices/calendar';
import { getLocationList } from '../../../../redux/slices/location';
import { getFoodList } from '../../../../redux/slices/food';


// ----------------------------------------------------------------------


export default function CreateMultipleTaskDialog() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { selectedRange } = useSelector(state => state.calendar);
    const { locationList } = useSelector((state) => state.location);
    const { cageList } = useSelector((state) => state.cage);
    const { foodList } = useSelector((state) => state.food);
    const EventSchema = Yup.object().shape({
        fromDate: Yup.date(),
        endDate: Yup.date()
    });

    useEffect(() => {
        dispatch(getCageList());
        dispatch(getLocationList());
        dispatch(getFoodList());
    }, [])

    const formik = useFormik({
        initialValues: {
            fromDate: selectedRange?.start ?? '',
            toDate: selectedRange?.end ?? '',
            cages: [],
        },
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                dispatch(createMultipleEvent(values, cageList, foodList));
                // enqueueSnackbar('Create event success', { variant: 'success' });
                // resetForm();
                // dispatch(openCreateMultipleTaskDialog());
                // setSubmitting(false);
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
                {locationList.map(location => {
                    const cages = cageList.filter(i => i?.locationid?.id === location.id);

                    return (
                        <Grid container spacing={1} style={{ margin: '5px 5px 10px 5px' }}>
                            Location: {location.name}
                            {cages.map((cage, index) => (
                                <Grid item key={index}>
                                    {`Cage ${cage.id}`}
                                    <Checkbox value={cage.id} onChange={(e, checked) => {
                                        if (checked) { setFieldValue('cages', [...values.cages, e.target.value]) }
                                        else { setFieldValue('cages', values.cages.filter(i => i !== e.target.value)) }
                                    }} />
                                </Grid>

                            ))}
                        </Grid>)
                })}


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