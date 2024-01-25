//redux/userSlice/postSlice.js


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the asynchronous thunk
export const fetchPostData = createAsyncThunk('post/fetchPostData', async () => {
  try {
    // Make your asynchronous API call here
    const response = await fetch('http:/localhost:5000/posts');
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle errors here
    console.error('Error fetching post data:', error);
    throw error;
  }
});

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    profileData: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setPostData: (state, action) => {
      state.profileData = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle the pending and fulfilled states of the async thunk
    builder.addCase(fetchPostData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPostData.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.profileData = action.payload;
    });
    builder.addCase(fetchPostData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export const { setPostData } = postSlice.actions;

export const selectProfileData = (state) => state.user.profileData;

export default postSlice.reducer;
