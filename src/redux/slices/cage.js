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
  console.log('payload', payload)
  const formData = buildCreateCageRequestBody(payload);
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
      window.location.reload();
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
  const cageInLocation = cageList.filter((item) => item?.locationid?.id === locationId);
  return cageInLocation.map((item) => {
    const numberOfBirdInCage = getNumberOfBirdInCage(item.id, birdInCageList);
    return { ...item, numberOfBirdInCage };
  });
}

function buildCreateCageRequestBody(payload) {
//   {
//     "type": "small",
//     "max":10,
//     "quantity": 10,
//     "locationID":1,
//     "birdTypeID":1
// }

  const data = new FormData();
  const cage = {
    max: payload.quantity,
    quantity: payload.quantity,
    type: payload.cageType,
    locationID: payload.location.id,
    birdTypeID: getBirdTypeIdBySpeciesIDAndStatus(payload.birdTypeList, payload.species, payload.status)
  };

  const { file } = payload;

  data.append('cage', JSON.stringify(cage));
  data.append('file', file);
  
  return data
}

// have species id, status id -> find bird type id

// species id = 1, status id = 1 
function getBirdTypeIdBySpeciesIDAndStatus(birdTypeList, specieID, status){

  const selectedBirdTypeId = birdTypeList.find(i => i.name === status && i.specieid.id === specieID);
  return selectedBirdTypeId.id;
}