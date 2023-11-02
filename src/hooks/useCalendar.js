import { useEffect, useState } from "react";
import { useSnackbar } from "notistack5";
import { useSelector } from "react-redux";
import useAuth from "./useAuth";
import { closeModal, closeTaskDialog, getEvents, openCreateMultipleTaskDialog, openLocationDialog, openTaskDialog, selectRange, updateEvent } from "../redux/slices/calendar";
import { getScheduleById } from "../utils/mock-data/localStorageUtil";
import { scheduleData } from "../utils/mock-data/schedule";
import { getLocationList } from "../redux/slices/location";

export const useCalendar = ({ dispatch, isMobile, calendarRef, cageId }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(isMobile ? 'listWeek' : 'dayGridMonth');
    const [selectedEvent, setSelectedEvent] = useState();
    const { events } = useSelector((state) => state.calendar);
    const { locationList } = useSelector((state) => state.location);

    // const events = scheduleData;

    console.log('event', events)
    const { user } = useAuth();
    const [isCreating, setIsCreating] = useState(false);



    const isManager = !!user && user?.role === 'manager';
     const scheduleBaseOnCage = scheduleData.filter((data) => data?.id === 1);
    
    const fullScheduleBaseOnRole = isManager ? events : events.filter((data) => data.staffId === user.id);
    const filteredScheduleData = fullScheduleBaseOnRole;



    useEffect(async () => {
        dispatch(getEvents());
        dispatch(getLocationList());
    }, []);

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            const newView = isMobile ? 'listWeek' : 'dayGridMonth';
            calendarApi.changeView(newView);
            setView(newView);
        }
    }, [isMobile]);

    const handleClickToday = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.today();
            setDate(calendarApi.getDate());
        }
    };

    const handleChangeView = (newView) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.changeView(newView);
            setView(newView);
        }
    };

    const handleClickDatePrev = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleClickDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    const handleSelectRange = (arg) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.unselect();
        }
        dispatch(selectRange(arg.start, arg.end));
        dispatch(openCreateMultipleTaskDialog());
    };

    // click on an event, open location form
    const handleSelectEvent = (arg) => {
        dispatch(openLocationDialog());
        // dispatch(selectedEvent(arg.event.id));
    };

    // const handleResizeEvent = async ({ event }) => {
    //     try {
    //         dispatch(
    //             updateEvent(event.id, {
    //                 allDay: event.allDay,
    //                 start: event.start,
    //                 end: event.end
    //             })
    //         );
    //         enqueueSnackbar('Update event success', { variant: 'success' });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const handleDropEvent = async ({ event }) => {
        try {
            dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end
                })
            );
            enqueueSnackbar('Update event success', {
                variant: 'success'
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddTask = () => {
        setIsCreating(true);
        dispatch(openTaskDialog());
    };

    const handleCloseModal = () => {
        setIsCreating(false);
        dispatch(closeModal());
    };

    const handleSelectTask = async (id) => {
        console.log("id", id);
        const event = await getScheduleById(id);
        setSelectedEvent(event);
        dispatch(openTaskDialog());
        setIsCreating(false);
    };

    const handleCloseTask = () => {
        setIsCreating(false);
        dispatch(closeTaskDialog());
    };

    const handleAddMultipleTasks = () => {
        dispatch(openCreateMultipleTaskDialog());
    }
    
    return {
        date,
        view,
        isManager,
        isCreating,
        locationList,
        selectedEvent,
        filteredScheduleData,
        handleClickToday,
        handleChangeView,
        handleClickDatePrev,
        handleClickDateNext,
        handleSelectRange,
        handleSelectEvent,
        // handleResizeEvent,
        handleDropEvent,
        handleAddTask,
        handleSelectTask,
        handleCloseModal,
        handleCloseTask,
        handleAddMultipleTasks

    }
}