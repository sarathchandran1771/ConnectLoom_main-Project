// src/user/redux/slices/userSlice.js

import  {apiSlice}  from '../api/apiSlice';
const Server_URL = 'http://localhost:5000/';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: 'new/user',
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: ( emailToken ) => ({
        url: `/verifyemail`,
        method: "POST",
        body: emailToken,
      }),
    }),
    
    updateUser: builder.mutation({
      query: (data) => ({
        url: `profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getAllPosts: builder.mutation({
      query: () => ({
        url: `${Server_URL}post/all-posts`,
        method: "GET",
      }),
    }),

    getDataPosted: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}post/dataPosted`,
        method: "GET",
        params:{
          userID:data
        }
      }),
    }),
    googleAuth: builder.mutation({
      query: (data) => ({
        url: 'google/authenticate',
        method: "POST",
        body: data,
      }),
    }),

    getReportPost: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}post/reportPost`,
        method: "PATCH",
          body: data
      }),
    }),
    deletePost: builder.mutation({
      query: ({postId }) => ({
        url: `${Server_URL}post/deletePosts/${postId}`,
        method: "DELETE",
      }),
    }),    

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useGetDataPostedMutation,
  useVerifyEmailMutation,
  useGoogleAuthMutation,
  useDeletePostMutation,
  useGetReportPostMutation,
  useGetAllPostsMutation,
} = userApiSlice;

