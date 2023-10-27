import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { getNumberOfBirdInCage } from './bird';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  foodList: [],
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
  console.log('payload ',payload)
  const body = buildCreateFoodRequestBody(payload);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/manager/foodnorm/create', body);
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


function buildCreateFoodRequestBody(payload) {
  // get bird type
  // get food type
  // get medicine
  //
  return {
    // birdType: 
    // foodType:
    // quantityFood:
    // medicine:
    // quantityMedicine:
    // numberOfFeeding:
    // startTime:
    // duration:
    // note: 
  }
}

// {
//   "birdType":  {
//           "id": 1,
//           "name": "t01",
//           "specieID": {
//               "id": 1,
//               "name": "specie 1",
//               "hibernateLazyInitializer": {}
//           }
//       },
//   "foodType": {
//           "id": 1,
//           "name": "ft001",
//           "quanti