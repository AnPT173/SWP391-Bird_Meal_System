import { createSlice } from '@reduxjs/toolkit';
import { filter, map } from 'lodash';
import { add } from 'date-fns';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
  country: null,
  isOpenLocationDialog: false,
  isOpenTaskDialog: false,
  isOpenCreateMultipleTaskDialog: false,

};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const event = action.payload;
      const updateEvent = map(state.events, (_event) => {
        if (_event.id === event.id) {
          return event;
        }
        return _event;
      });

      state.isLoading = false;
      state.events = updateEvent;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = filter(state.events, (user) => user.id !== eventId);
      state.isLoading = false;
      state.events = deleteEvent;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenCalendarFormDialog = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
      state.isOpenCalendarFormDialog = true;
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    openLocationDialog(state) {
      state.isOpenLocationDialog = true;
    },

    openTaskDialog(state) {
      state.isOpenTaskDialog = true;
    },

    openCreateMultipleTaskDialog(state) {
      state.isOpenCreateMultipleTaskDialog = !state.isOpenCreateMultipleTaskDialog;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
      state.isOpenLocationDialog = false;

    },

    closeTaskDialog(state) {
      state.isOpenTaskDialog = false;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, openLocationDialog, openTaskDialog, closeTaskDialog, openCreateMultipleTaskDialog } = slice.actions;

// ----------------------------------------------------------------------

export function getEvents() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log("before")
      const response = await axios.get('/manager/schedule/getall');
      console.log("before2")
      const transformedResponse = buildTaskResponse(response.data)
      console.log(transformedResponse);
      console.log(response.data);
      dispatch(slice.actions.getEventsSuccess(transformedResponse));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent) {
  console.log("new event", newEvent);
  const requestBody = buildCreateTaskRequestBody(newEvent)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/manager/schedule/create', requestBody);
      dispatch(slice.actions.createEventSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(eventId, updateEvent) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/update', {
        eventId,
        updateEvent
      });
      dispatch(slice.actions.updateEventSuccess(response.data.event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/calendar/events/delete', { eventId });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
  return async (dispatch) => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
}
// {
//   color: "#33",
//   title: "Task for cage xx",
//   description: "description",
//   birdDTOList:[

//   birdID: 1,
//   foodTypeID:1,
//   schedules:[{
//   startDate:'2023-01-01 18:00:00',
//   endDate:'2023-01-02 18:00:00',
//   staffID:1,
//   note:"non",
//   status:0
//   }],
//   quantity:10
//   ]
//   }
function buildCreateTaskRequestBody(payload) {
  return {
    color: payload.textColor,
    title: payload.title,
    description: payload.description,
    birdDTOList: [
      {
        birdID: 1,
        foodTypeID: 1,
        schedules: [
          {
            startDate: formatDate(payload.start),
            endDate: formatDate(payload.start),
            staffID: payload.staffId,
            note: '',
            status: 0
          }],
        quantity: 10,
      }
    ]
  }
}

function buildTaskResponse(responses) {
  const result =  Object.values(responses).map((response) =>{
    const data = {
      id: response.id,
      cageId: getCageFromBird(),
      title: response.title,
      foodType: response.foodTypeID.id,
      start: add(new Date(), { days: 0, hours: 0, minutes: 35 }),
      end: add(new Date(), { days: 0, hours: 0, minutes: 45 }),
      foodQuantity: response.quantity,
      staffId: response.staff.accountName,
      feedingRegimen: "None",
      locationId: 1
    }

    return data
  })

  console.log('result', result)
  return result
}

function getCageFromBird() {
  return 1
}

function stringToDate(input) {
  // Parse the string as a Date object
  const date = new Date(input);

  // Create a new Date object with the same value but adjusted for the local time zone
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  // Extract the date and time components
  const day = localDate.getDate();
  const month = localDate.getMonth() + 1;
  const year = localDate.getFullYear();
  const hour = localDate.getHours();
  const minute = localDate.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  // Format the components using string concatenation and conditional operators
  const output = `${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""}${month}/${year} ${(hour % 12) || 12}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;
  // Return or display the output
  console.log(output); // 01/01/2023 06:00 PM
  return output
}

function formatDate(input) {
  const date = new Date(input);
  const isoDate = date.toISOString().substring(0, 16).replace('T', ' ');
  return isoDate;
}
