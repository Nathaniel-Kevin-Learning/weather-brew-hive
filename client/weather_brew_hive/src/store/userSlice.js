import { createSlice } from '@reduxjs/toolkit';
import ErrorSweetAlert from '../utils/ErrorSweetAlert';

import axios from 'axios';
import NormalSuccessSweetAlert from '../utils/NormalSuccessSweetAler';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    password: '',
  },
  reducers: {
    changeEmail: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.email = action.payload;
    },
    changePassword: (state, action) => {
      state.password = action.payload;
    },
    backToDefault: (state) => {
      state.email = '';
      state.password = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeEmail, changePassword, backToDefault } = userSlice.actions;

export function loginUser(email, password) {
  return async function (dispatch, getState) {
    try {
      let { data } = await axios({
        url: import.meta.env.VITE_BASE_URL + '/login',
        method: 'POST',
        data: {
          email,
          password,
        },
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      return { success: true };
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    }
  };
}

export function registerUser(email, password) {
  return async function (dispatch, getState) {
    try {
      let { data } = await axios({
        url: import.meta.env.VITE_BASE_URL + '/register',
        method: 'POST',
        data: {
          email,
          password,
        },
      });

      NormalSuccessSweetAlert('New user successfully created');
      return { success: true };
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    }
  };
}

export default userSlice.reducer;
