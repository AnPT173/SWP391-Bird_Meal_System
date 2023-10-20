import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  birdList: []
};

const slice = createSlice({
  name: 'bird',
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
    getBirdListSuccess(state, action) {
      state.isLoading = false;
      state.birdList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
// export const { onToggleFollow, deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function createBird(payload) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/manager/bird/create');
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getBirdList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/manager/bird/');
      // d ispatch set bird to redux
      dispatch(slice.actions.getBirdListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
