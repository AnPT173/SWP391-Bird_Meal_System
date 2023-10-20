import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  cageList: []
};

const slice = createSlice({
  name: 'cage',
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
    getCageListSuccess(state, action) {
      state.isLoading = false;
      state.cageList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
// export const { onToggleFollow, deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function createCage(payload) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/manager/cage/create');
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCageList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    console.log('get cage');
    try {
      const response = await axios.get('/manager/cage/');
      console.log('res',response)
      // dispatch set bird to redux
      dispatch(slice.actions.getCageListSuccess(response.data));
    } catch (error) {
      console.log('error',error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
