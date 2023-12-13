import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = {
        _id: action.payload._id,
        username: action.payload.username,
        emailId: action.payload.emailId,
        profilename:action.payload.profilename,
        bio:action.payload.Bio,
        profilePic:action.payload.profilePic,
        privatePublic:action.payload.privatePublic,
      };
      state.token = action.payload.token;
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      localStorage.setItem("token", state.token);
    },
    logout: (state, action) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
  },
});



export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;




// import {createSlice} from "@reduxjs/toolkit"

// const initialState = {
//   userInfo: localStorage.getItem('userInfo')
//     ? JSON.parse(localStorage.getItem('userInfo'))
//     : null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       state.userInfo = action.payload;
//       localStorage.setItem('userInfo', JSON.stringify(action.payload));
//     },
//     logout: (state, action) => {
//       state.userInfo = null;
//       localStorage.removeItem('userInfo');
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;

// export default authSlice.reducer;