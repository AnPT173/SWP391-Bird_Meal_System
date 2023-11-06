import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { formatDate } from './calendar';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  birdList: [],
  birdInCage: [],
  birdTypeList: [],
  species: []
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
    },

    getBirdTypeSuccess(state, action) {
      state.isLoading = false;
      state.birdTypeList = action.payload;
    },

    getSpecieListSuccess(state, action) {
      state.isLoading = false;
      state.species = action.payload;
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
        transformRequest: (formData) => formData
      });
      dispatch(slice.actions.afterCreateBirdSuccess(response.data));
      window.location.reload();
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

export function getBirdType() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/manager/birdtype/');

      dispatch(slice.actions.getBirdTypeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSpecieList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('manager/species/');

      dispatch(slice.actions.getSpecieListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getNumberOfBirdInCage(cageId, birdInCageList) {
  return birdInCageList.reduce((acc, cur) => (cur?.cageid?.id === cageId ? (acc += 1) : acc), 0);
}

export function buildCurrentBirdInfo(cageId, birdId, birdList, birdInCage) {
  const currentBird = birdList.find((bird) => bird?.id === birdId);
  const currentBirdInCage = birdInCage.find((bird) => bird?.birdID?.id === birdId);
  return { ...currentBird, ...currentBirdInCage };
}

export function getBirdAge(dateInString) {
  // input date with pattern yyyy-mm-dd
  console.log(dateInString);
  const parts = dateInString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const differenceInMilliSeconds = Math.abs(new Date() - new Date(year, month, day));
  const date1 = new Date(year, month, day);
  const date2 = new Date(); // the current date
  const yearDiff = date2.getFullYear() - date1.getFullYear(); // the difference in years
  const monthDiff = date2.getMonth() - date1.getMonth(); // the difference in months
  return yearDiff * 12 + monthDiff;
}

function buildBirdCreateRequestBody(payload) {
  const date = formatDate(payload?.hatchingDate).split(' ');
  const data = new FormData();
  const bird = {
    name: payload.birdName,
    age: date[0],
    birdTypeID: payload.birdType.id,
    cageID: payload.cageId,
    statusID: 1,
    gender: payload.gender === '1',
    attituteds: payload.attitudes,
    qualities: payload.qualities,
    appearance: payload.appearance,
    color: payload.featherColor,
    exotic: true,
    exoticrate: 1
  };
  const { file } = payload;

  data.append('bird', JSON.stringify(bird));
  data.append('file', file);
  return data;
}
