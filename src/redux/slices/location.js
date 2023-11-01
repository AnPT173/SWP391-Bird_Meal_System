import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { saveCurrentLocation } from '../../utils/mock-data/localStorageUtil';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  locationList: []
};

const slice = createSlice({
  name: 'location',
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
    getLocationListSuccess(state, action) {
      state.isLoading = false;
      state.locationList = action.payload;
    },

    afterCreateLocationSuccess(state, action) {
      const newLocationList = [...state.locationList, action.payload];
      state.isLoading = false;
      state.locationList = newLocationList;
    }
}});

// Reducer
export default slice.reducer;

// Actions
// export const { } = slice.actions;

// ----------------------------------------------------------------------

export function createLocation(payload, setCurrentTab) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/location/create', payload);
      setCurrentTab(payload.name);
      await saveCurrentLocation(response.data);
      dispatch(slice.actions.afterCreateLocationSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getLocationList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/location/');
      dispatch(slice.actions.getLocationListSuccess(response.data));
    } catch (error) {
      console.log('error',error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
