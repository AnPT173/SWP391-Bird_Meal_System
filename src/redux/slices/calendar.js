import { createSlice } from '@reduxjs/toolkit';
import { add, addDays } from 'date-fns';
import { filter, map } from 'lodash';
// utils
import axios from '../../utils/axios';
import { getOriginalScheduleById, saveOriginalSchedule, saveSchedule } from '../../utils/mock-data/localStorageUtil';

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
      const response = await axios.get('/manager/schedule/getall');
      await saveOriginalSchedule(response.data);
      const transformedResponse = buildTaskResponse(response.data)
      await saveSchedule(transformedResponse);
      dispatch(slice.actions.getEventsSuccess(transformedResponse));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent, foods, medicines) {
  console.log('payload', newEvent)
  const requestBody = buildCreateTaskRequestBody(newEvent, foods, medicines)
  console.log('body', requestBody)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/manager/schedule/create', requestBody);
      dispatch(slice.actions.createEventSuccess(response.data));
      window.location.reload();
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function createMultipleEvent(values, cageList, foodNormList) {
  console.log("multiple, ", values, cageList, foodNormList)
  const requestBody = buildRequestBodyForMultipleEvents(values, cageList, foodNormList);
  console.log("request bosy", requestBody)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/manager/schedule/create', requestBody);
      dispatch(slice.actions.createEventSuccess(response.data));
      window.location.reload();
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };

}
// ----------------------------------------------------------------------

export function updateEvent(eventId, updateEvent) {

  console.log('update 1')
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const originalData = await getOriginalScheduleById(eventId);
      const { textColor } = updateEvent;

      originalData.task.color = textColor;
      console.log('update 12')
      const response = await axios.post(`/manager/schedule/updateInfoTaskBird/${eventId}`, { ...originalData });
      dispatch(slice.actions.updateEventSuccess(response.data));
    } catch (error) {
      console.log('update 13')
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
//   "accountID" : 2,
//     "color": "aaa",
//       "title": "abc",
//         "description": "abc",
//           "cageTaskDTOList": [
//             {
//               "cageID": 1,
//               "schedules": [
//                 {
//                   "startDate": "2023-10-10 19:00",
//                   "endDate": "2023-10-10 20:00",
//                   "staffID": 1,
//                   "note": "abc",
//                   "status": 1,
//                   "foodList": [
//                       // {
//                       "foodType": {
//                         "id": 1,
//                         "name": "ft001",
//                         "quantity": 10
//                       },
//                       "quantity": 10
//                     }
//                   ],
//                   "medicineList": [
//                     {
//                       "medicine": {
//                         "id": 1,
//                         "quantity": 10,
//                         "name": "meoo1"
//                       },
//                       "quantity": 10
//                     }
//                   ]
//                 }
//               ],
//               "foodNormID": 1

//             }
//           ]
// }
function buildCreateTaskRequestBody(payload, foods, medicines) {
  return {
    accountID: payload.staffId,
    color: payload.textColor,
    title: payload.title,
    description: payload.description,
    cageTaskDTOList: buildCageList(payload, foods, medicines)
  }
}

function buildCageList(payload, foods, medicines) {
  const cages = payload?.cageId;
  const cageDTOs = [];
  cages.forEach(item => {
    const cageDTO = {
      cageID: item,
      schedules: [{
        startDate: formatDate(payload.start),
        endDate: formatDate(payload.start),
        staffID: payload.staffId,
        note: 'abc',
        status: 1,
        foodList: buildFoodList(payload, foods),
        medicineList: buildMedicineList(payload, medicines)
      }
      ]
    }
    cageDTOs.push(cageDTO);
  });
  return cageDTOs;
}

function buildFoodList(payload, foods) {
  if (payload?.foods) {
    const foodList = [];
    const selectedFoods = payload?.foods;
    selectedFoods.forEach(food => {
      const foodType = foods.find(f => f.id === food.id);
      const { quantity } = food;
      foodList.push({
        foodType: { ...foodType },
        quantity
      })
    })

    return foodList;
  }
  return []

}

function buildMedicineList(payload, medicines) {
  if (payload?.medicines) {
    const medicineList = [];
    const selectedMedicines = payload?.medicines;
    selectedMedicines.forEach(item => {
      const medicine = medicines.find(m => m.id === item.id);
      const quantity = item.dose;
      medicineList.push({
        medicine: { ...medicine },
        quantity
      })
    })
    return medicineList;
  }
  return []

}

function buildTaskResponse(responses) {
  const result = Object.values(responses).map((response, index) => {
    const { task, cageid, staffid } = response;

    const data = {
      id: response.id,
      taskId: task.id,
      cageId: cageid.id,
      title: response.task.title,
      description: response.task.description,
      foods: response.taskBirdFoods,
      medicines: response.taskBirdMedicines,
      start: new Date(response.startDate),
      end: new Date(response.endDate),
      foodQuantity: response?.quantity ?? 100,
      staffId: staffid,
      feedingRegimen: response.note,
      locationId: cageid.locationid,
      color: response?.task?.color
    }

    return data
  })

  return result
}

function buildRequestBodyForMultipleEvents(values, cageList, foodNormList) {
  return {
    accountID: values?.staffId ?? 1,
    color: '#94D82D',
    title: 'Feeding bird',
    description: 'Feeding bird',
    cageTaskDTOList: buildCageListForCreateMultipleEvent(values, cageList, foodNormList)
  }
}

function buildCageListForCreateMultipleEvent(values, cageList, foodNormList) {
  const timeDiff = values.toDate.getTime() - values.fromDate.getTime();
  const dayDiff = Math.round(Math.abs(timeDiff / (1000 * 60 * 60 * 24)));
  console.log('dayDiff',add(new Date(values.fromDate), 0));
  const { cages } = values;
  const cageDTOs = [];
  cages.forEach(item => {
    for (let i = 0; i < dayDiff; i+=1) {
      console.log(',i', i)
      const cageDTO = {
        cageID: item,
        schedules: [{
          startDate: formatDate(addDays(new Date(values.fromDate), i)),
          endDate: formatDate(addDays(new Date(values.toDate), i)),
          staffID: values?.staffId ?? 1,
          note: 'Batch schedule',
          status: 1,
          foodNormID: getFoodNormByCageId(item, cageList, foodNormList)
        }
        ]
      }
      cageDTOs.push(cageDTO);
    }
  });
  return cageDTOs;
}

function getFoodNormByCageId(cageId, cageList, foodNormList) {
  console.log("cage list,", cageList)
  const cage = cageList.find(cage => cage.id === +cageId);
  const foodNorm = foodNormList.find(i => i.birdTypeid.id === cage?.birdTypeid?.id);
  console.log('birdTypeid', cage);
  console.log('food norm id', foodNorm?.id);
  return foodNorm?.id;
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
  console.log('input', input)
  const date = new Date(input);
  const isoDate = date.toISOString().substring(0, 16).replace('T', ' ');
  return isoDate;
}
