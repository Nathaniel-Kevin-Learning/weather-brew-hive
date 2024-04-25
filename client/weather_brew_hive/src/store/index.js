import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import postSlice from './postSlice';
import typeSlice from './typeSlice';

export default configureStore({
  reducer: { user: userSlice, post: postSlice, type: typeSlice },
});
