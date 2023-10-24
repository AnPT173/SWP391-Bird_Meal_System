import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  birdList: [],
  birdInCage: []
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
    },

    afterCreateBirdSuccess(state, action) {
      state.isLoading = false;
      const birds = state.birdList;
      state.birdList = [...birds, action.payload];
    },

    getBirdInCageSuccess(state, action) {
      state.isLoading = false;
      state.birdInCage = action.payload;
    }

  }
});

// Reducer
export default slice.reducer;

// Actions
// export const { onToggleFollow, deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function createBird(payload) {
  const formData = buildBirdCreateRequestBody(payload);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/manager/bird/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        transformRequest: formData => formData
      });

      console.log("after create", response);
      dispatch(slice.actions.afterCreateBirdSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getBirdList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/manager/bird/');

      dispatch(slice.actions.getBirdListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getBirdInCageList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/manager/birdcage/');

      dispatch(slice.actions.getBirdInCageSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getNumberOfBirdInCage(cageId, birdInCageList) {

  return birdInCageList.reduce((acc, cur) => cur?.cageID.id === cageId ? acc += 1 : acc, 0);

}

export function buildCurrentBirdInfo(cageId, birdId, birdList, birdInCage) {
  const currentBird = birdList.find(bird => bird.id === birdId);
  const currentBirdInCage = birdInCage.find(bird => bird?.birdID?.id === birdId);
  return { ...currentBird, ...currentBirdInCage };

}

export function getBirdAge(dateInString) {
  // input date with pattern yyyy-mm-dd
  console.log(dateInString)
  const parts = dateInString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const differenceInMilliSeconds = Math.abs(new Date() - new Date(year, month, day));
  return Math.floor(differenceInMilliSeconds / (1000 * 60 * 60 * 24));

}

function buildBirdCreateRequestBody(payload) {
  const data = new FormData();
  const bird = {
    name: payload.birdName,
    age: '2021-01-01',
    birdTypeID: 1,
    cageID: 1,
    statusID: 1,
    gender: 1
  }
  const { file } = payload;

  data.append('bird', JSON.stringify(bird));
  data.append('file', file);
  return data
}