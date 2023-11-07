import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { formatDate } from './calendar';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  foodList: [], // food norm
  foodTypeList: [],
  medicineList: []
};

const slice = createSlice({
  name: 'food',
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
    getFoodListSuccess(state, action) {
      state.isLoading = false;
      state.foodList = action.payload;
    },

    getFoodTypeListSuccess(state, action) {
      state.isLoading = false;
      state.foodTypeList = action.payload;
    },

    getMedicineListSuccess(state, action) {
      state.isLoading = false;
      state.medicineList = action.payload;
    },

    afterCreateFoodSuccess(state, action) {
      state.isLoading = false;
      const foods = state.foodList;
      state.foodList = [...foods, action.payload];
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
// export const { onToggleFollow, deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function createFood(payload) {
  const body = buildCreateFoodRequestBody(payload);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/manager/foodnorm/update/${payload.currentPlan.id}`, body);
      dispatch(slice.actions.afterCreateFoodSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getFoodList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/manager/foodnorm/get');
      dispatch(slice.actions.getFoodListSuccess(response.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getFoodTypeList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('manager/foodtype/');
      dispatch(slice.actions.getFoodTypeListSuccess(response.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getMedicineList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/manager/medicine/');
      dispatch(slice.actions.getMedicineListSuccess(response.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


// {
//   "birdType" : {
//     "id": 1,
//     "name": "t01",
//           "specieid": {
//               "id": 1,
//               "name": "specie 1"
//           }        
//   },
//   "duration" : 30,
//   "numberOfFeeding" : 2,
//   "startTime" : "07:00",
//   "note" : "abc",
//   "foodNormMedicineDTOS" : [
//   {
//   "medicine" :  {
//           "id": 1,
//           "quantity": 10,
//           "name": "meoo1"
//       },
//   "quantity" : 10
//   }
//   ],
//   "foodNormFoodDTOS" : [
//   {
//   "foodType" : {
//   "id" : 1,
//   "quantity" : 10,
//   "name": "ff002"
//   },
//   "quantity" : 10
//   }
//   ]
//   }

function buildCreateFoodRequestBody(payload) {
  console.log('create food payload', payload)
  const {currentPlan, birdTypeList} = payload;
  return {
    // birdType: getBirdType(payload),
    // foodType: getFoodType(payload),
    // quantityFood: payload.products[0]?.quantity ?? 10,
    // medicine: payload.medicineList[0],
    // quantityMedicine: 10,
    // numberOfFeeding: payload.numberOfFeedings,
    // startTime: '2023-02-10T07:07:00',
    // duration: payload.duration,
    // note: payload.note

    // get from bird type list
    id: currentPlan?.id,
    birdType: getBirdType(currentPlan, birdTypeList),
    duration: payload.duration,
    numberOfFeeding: payload.numberOfFeedings,
    startTime:getTimeInHHMM(payload.start),
    note: payload.note,
    foodNormMedicineDTOS: payload.medicines,
    foodNormFoodDTOS: payload.foods,
    water: payload.water
  }
}


function getBirdType(currentPlan, birdTypeList) {
  const { specieId, status} = currentPlan;
  const selectedBirdType = birdTypeList.find(i => i?.specieid?.id === +specieId && i.name === status);
  console.log('selected bird type', selectedBirdType);
  return selectedBirdType
}

function getFoodType(payload) {
  const { products, foodTypeList } = payload;
  const foodTypeId = products[0]?.product ?? 1;
  const foodType = foodTypeList.find(item => item.id === foodTypeId);
  return {
  }
}

export function getCurrentFoodPlan(speciesId, periodId, payload) {
  const birdType = payload.filter(item => item.birdType?.id === periodId);
  const species = birdType.find(item => item?.birdType?.specieid?.id === speciesId);
  console.log('species', species);
  return species;
}

function getTimeInHHMM(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Concatenate the hours and minutes with a colon
  const time = `${hours < 10 ? '0': ''}${hours}:${minutes< 10 ? '0': ''}${minutes}:00`;
  console.log('time in hh:mm', time)
  return time;
}