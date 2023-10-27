import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import { useRef } from 'react';
// material
import { Button, Card, Container, DialogTitle, Grid, Stack, Typography, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useParams } from 'react-router';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../components/_dashboard/calendar';
import { DialogAnimate } from '../../components/animate';
import { useCalendar } from '../../hooks/useCalendar';
import { openCreateMultipleTaskDialog } from '../../redux/slices/calendar';
import CreateMultipleTaskDialog from '../../components/_dashboard/user/cards/CreateMultipleTaskDialog';

// ----------------------------------------------------------------------


const getStatusColor = (status) => {
  switch (status) {
    case 'Feeded':
      return '#94D82D';
    case 'Pending':
      return '#FFC107';
    case 'Late':
      return '#FF4842';
    default:
      return '#00AB55';
  }
};
const cageLocation = [
  {
    id: 1,
    value: 'Normal'
  },
  {
    id: 2,
    value: 'Sick'
  },
  {
    id: 3,
    value: 'Birth'
  },
  {
    id: 4,
    value: 'Etoxic'
  }
];
const locationBackgroundColor = [
  {
    color1: '#80bbcd',
    color2: '#35bb60'
  },
  {
    color1: '#FBEAEB',
    color2: '#2F3C7E'
  },
  {
    color1: '#101820',
    color2: '#FEE715'
  },
  {
    color1: 'green',
    color2: 'blue'
  },
  {
    color1: '#4831D4',
    color2: '#CCF381'
  },
  {
    color1: '#E2D1F9',
    color2: '#317773'
  }
];

function CageLabel({ id, title, quantity, onClick, status }) {
  const color = getStatusColor(status);
  return (
    <Typography
      onClick={() => onClick(id)}
      variant="h6"
      align="center"
      style={{ backgroundColor: color, 'border-radius': '5px', 'margin-bottom': '5px' }}
    >
      {title}
      <br />
      {quantity}
    </Typography>
  );
}

function LocationScheduleMap(props) {
  const color = locationBackgroundColor[Math.floor(Math.random() * 4)];

  return (
    <Grid container spacing={1} style={{ margin: '5px 5px 10px 5px' }}>
      {props.data.map((item, index) => (
        <Grid item xs={4} key={index}>
          <CageLabel
            id={item.id}
            title={item.cageId}
            quantity={item.foodQuantity}
            onClick={props.onClick}
            status={item.status}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default function Calendar() {
  const { themeStretch } = useSettings;
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef(null);
  const { cageId } = useParams();
  const { start, end, selectedRange, isOpenTaskDialog, isOpenLocationDialog, isOpenCreateMultipleTaskDialog } = useSelector(state => state.calendar);
  const {
    date,
    view,
    isManager,
    isCreating,
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
  } = useCalendar({ dispatch, isMobile, calendarRef, cageId });


  const cageIdTitle = cageId ? `    ||    CageId: ${cageId}` : '';

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
                  onClick={handleAddTask}
                >
                  New Event
                </Button>
              )}
              {isManager && (
                <Button
                  variant="contained"
                  hidden
                  startIcon={<Icon icon={plusFill} width={20} height={20} />}
                  onClick={handleAddMultipleTasks}
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
              events={filteredScheduleData}
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
              // eventResize={handleResizeEvent}
              height={isMobile ? 'auto' : 720}
              plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
            />
          </CalendarStyle>
        </Card>

        <DialogAnimate open={isOpenLocationDialog} maxwidth="md" onClose={handleCloseModal}>
          <Stack direction="column" spacing={2}>
            <DialogTitle>Event by Location</DialogTitle>
            {cageLocation.map((item) => {
              const data = filteredScheduleData.filter((i) => i.locationId === item.id);
              return (
                <>
                  {data && data.length > 0 && <Typography>{item.value}</Typography>}
                  <LocationScheduleMap data={data} onClick={handleSelectTask} />
                </>
              );
            })}
          </Stack>
        </DialogAnimate>

        <DialogAnimate open={isOpenTaskDialog} onClose={handleCloseTask}>
          <CalendarForm
            event={selectedEvent}
            isCreating={isCreating}
            range={selectedRange}
            onCancel={handleCloseTask}
          />
        </DialogAnimate>

        <DialogAnimate open={isOpenCreateMultipleTaskDialog} onClose={() => openCreateMultipleTaskDialog()}>
          <CreateMultipleTaskDialog />
        </DialogAnimate>
      </Container>
    </Page>
  );
}
