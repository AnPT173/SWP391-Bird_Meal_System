import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { getNumberOfBirdInCage } from './bird';

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
    },

    afterCreateCageSuccess(state, action) {
      state.isLoading = false;
      const cages = state.cageList;
      state.cageList = [...cages, action.payload];
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
// export const { onToggleFollow, deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function createCage(payload) {
  const formData = buildCreateCageRequestBody(payload);
  console.log('payload', payload);
  console.log('formData', formData);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/manager/cage/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        transformRequest: (formData) => formData
      });
      dispatch(slice.actions.afterCreateCageSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCageList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/manager/cage/');
      dispatch(slice.actions.getCageListSuccess(response.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function buildCurrentLocationCageList(locationId, cageList, birdInCageList) {
  const cageInLocation = cageList.filter((item) => item?.location?.id === locationId);
  return cageInLocation.map((item) => {
    const numberOfBirdInCage = getNumberOfBirdInCage(item.id, birdInCageList);
    return { ...item, numberOfBirdInCage };
  });
}

function buildCreateCageRequestBody(payload) {
  const requestBody = new FormData();
  const cage = {
    max: payload.quantity,
    quantity: payload.quantity,
    type: payload.cageType,
    locationID: payload.location.id
  };

  const { file } = payload.file;

  requestBody.append('cage', cage);
  requestBody.append('file', file);
  return requestBody;
}

// {
//   "max":2,
//   "quantity":2,
//   "type":"TP01",
//   "locationID": 1
//   }
// }