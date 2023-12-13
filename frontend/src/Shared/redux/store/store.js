// src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../../redux/api/apiSlice";
import authReducer from "../userSlices/authSlice";
import postData from '../userSlices/postSlice';
import adminAuthReducer  from '../../redux/adminSlices/adminAuthSlice'


const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    postData: postData,
    adminAuth: adminAuthReducer,

  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
export default store;
