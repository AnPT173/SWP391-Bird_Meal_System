import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useRef, useEffect } from 'react';
// material
import { styled, useTheme } from '@material-ui/core/styles';
import { Card, Button, Container, DialogTitle, useMediaQuery, Stack, Typography, Grid } from '@material-ui/core';
import { useLocation, useParams } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { scheduleData } from '../../utils/mock-data/schedule';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getEvents,
  openModal,
  closeModal,
  updateEvent,
  selectEvent,
  selectRange,
  openCalendarFormDialog
} from '../../redux/slices/calendar';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { DialogAnimate } from '../../components/animate';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../components/_dashboard/calendar';
import Label from '../../components/Label';
import AssignTaskForm from '../../components/_dashboard/calendar/AssignTaskForm';

// ----------------------------------------------------------------------

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};
const cageLabelColor = ['red', 'green', 'blue', 'yellow'];
const locationBackgroundColor = ['#c3b1b1', '#adcfb1', '#adc1cf', '#b0adcf'];

function CageLabel({ title, onClick }) {
  const color = cageLabelColor[Math.floor(Math.random() * 4)];
  return (
    <Typography
      onClick={onClick}
      variant="h6"
      align="center"
      style={{ backgroundColor: color, 'border-radius': '5px', 'margin-bottom': '5px' }}
    >
      {title}
      <br />
      65
    </Typography>
  );
}

function LocationScheduleMap(props) {
  const color = locationBackgroundColor[Math.floor(Math.random() * 4)];
  return (
    <Grid container spacing={1} style={{ backgroundColor: color, margin: '5px 5px 10px 5px' }}>
      {props.data.map((item, index) => (
        <Grid item xs={4} key={index}>
          <CageLabel title={item} onClick={props.onClick} />
        </Grid>
      ))}
    </Grid>
  );
}

export default function Calendar() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenTaskDialog, setIsOpenTaskDialog] = useState(false);

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(isMobile ? 'listWeek' : 'dayGridMonth');
  const selectedEvent = useSelector(selectedEventSelector);
  const { events, isOpenModal, selectedRange, isOpenCalendarFormDialog } = useSelector((state) => state.calendar);
  const { user } = useAuth();
  const { cageId } = useParams();
  const isManager = !!user && user?.role === 'manager';
  console.log(events);
  const scheduleBaseOnCage = scheduleData.filter((data) => data.cageId === cageId);
  const fullScheduleBaseOnRole = isManager ? scheduleData : scheduleData.filter((data) => data.staffId === user.id);

  const filterdScheduleData = cageId ? scheduleBaseOnCage : fullScheduleBaseOnRole;

  const cageIdTitle = cageId ? `    ||    CageId: ${cageId}` : '';
  const simulateSchedule = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig'];

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

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
  };

  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleResizeEvent = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end
        })
      );
      enqueueSnackbar('Update event success', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

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


  const handleAddEvent = () => {
    dispatch(openCalendarFormDialog());
  };

  const handleCloseModal = () => {
    setIsOpenTaskDialog(false);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'Feeded':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Late':
        return 'error';
      default:
        return 'primary';
    }
  };
  const onSelectTask = (event) => {
    openCalendarFormDialog();
  };

  const handleCloseFrom = () => {};
  return (
    <Page title={`Calendar${cageIdTitle}`}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={`Calendar${cageIdTitle}`}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Calendar' }]}
          action={
            <Stack direction="row" spacing={1.5}>
              {isManager && (
                <Button
                  variant="contained"
                  startIcon={<Icon icon={plusFill} width={20} height={20} />}
                  onClick={handleAddEvent}
                >
                  New Event
                </Button>
              )}
              {isManager && (
                <Button
                  variant="contained"
                  hidden
                  startIcon={<Icon icon={plusFill} width={20} height={20} />}
                  onClick={handleAddEvent}
                >
                  New Batch Event
                </Button>
              )}
            </Stack>
          }
        />

        <Card>
          <CalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              events={filterdScheduleData}
              ref={calendarRef}
              rerenderDelay={10}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              eventResizableFromStart
              select={handleSelectRange}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isMobile ? 'auto' : 720}
              plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
            />
          </CalendarStyle>
        </Card>

        <DialogAnimate open={isOpenModal} maxwidth="md" onClose={handleCloseModal}>
          <Stack direction="column" spacing={2}>
            <DialogTitle>Event by Location</DialogTitle>
            <Typography>Location zz</Typography>
            <LocationScheduleMap data={simulateSchedule} onClick={onSelectTask} />
            <p>Location xx0</p>
            <LocationScheduleMap data={simulateSchedule} onClick={onSelectTask} />
            <p>Location xx0</p>
            <LocationScheduleMap data={simulateSchedule} onClick={onSelectTask} />
          </Stack>
        </DialogAnimate>

        <DialogAnimate open={isOpenCalendarFormDialog} onClose={handleCloseModal}>
          <CalendarForm event={selectedEvent} range={selectedRange} onCancel={handleCloseModal} />
        </DialogAnimate>
      </Container>
    </Page>
  );
}
