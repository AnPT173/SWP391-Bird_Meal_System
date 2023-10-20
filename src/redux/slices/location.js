import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

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
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
// export const { onToggleFollow, deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function createLocation(payload) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/location/create', payload);
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
      console.log('res',response)
      // dispatch set bird to redux
      dispatch(slice.actions.getLocationListSuccess(response.data));
    } catch (error) {
      console.log('error',error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
