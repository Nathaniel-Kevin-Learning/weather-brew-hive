import { createSlice } from '@reduxjs/toolkit';
import ErrorSweetAlert from '../utils/ErrorSweetAlert';
import axios from 'axios';
import NormalSuccessSweetAlert from '../utils/NormalSuccessSweetAler';

export const typeSlice = createSlice({
  name: 'post',
  initialState: {
    typeData: [],
    typeLoading: true,
  },
  reducers: {
    fetchTypeData: (state, action) => {
      state.typeData = action.payload;
    },
    fetchTypeLoading: (state, action) => {
      state.typeLoading = action.payload;
    },
  },
});

export const { fetchTypeData, fetchTypeLoading } = typeSlice.actions;

export function fetchDataType() {
  return async function (dispatch, getState) {
    try {
      const { data } = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/types',

        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      dispatch(fetchTypeData(data));
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    } finally {
      dispatch(fetchTypeLoading(false));
    }
  };
}
export default typeSlice.reducer;
