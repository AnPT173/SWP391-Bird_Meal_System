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
import { Button, Card, Container, DialogTitle, Stack, Typography, useMediaQuery } from '@material-ui/core';
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
import { LocationScheduleMap } from '../../components/_dashboard/user/cards';
import CreateMultipleTaskDialog from '../../components/_dashboard/user/cards/CreateMultipleTaskDialog';
import { DialogAnimate } from '../../components/animate';
import { useCalendar } from '../../hooks/useCalendar';
import { openCreateMultipleTaskDialog } from '../../redux/slices/calendar';

// ----------------------------------------------------------------------


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
    cageList,
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
              // select={handleSelectRange}
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
            <DialogTitle>Tasks</DialogTitle>
            {locationList && locationList?.map((item) => {
              if (filteredScheduleData[filteredScheduleData.length - 1] === '') { window.location.reload(); }
              const data = filteredScheduleData.filter((i) => i?.locationId?.id === item?.id);
              return (
                <>
                  {data && data.length > 0 && <Typography>{item.name}</Typography>}
                  <LocationScheduleMap data={data} onClick={handleSelectTask} locationList={locationList} cageList={cageList} />
                </>
              );


            })}
          </Stack>
        </DialogAnimate>

        <DialogAnimate open={isOpenTaskDialog} onClose={handleCloseTask} maxwidth="md">
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
