// adminAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.adminToken = action.payload.token; 
      localStorage.setItem("adminToken", state.adminToken);
    },
    logout: (state, action) => {
      state.adminToken = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { setCredentials, logout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
