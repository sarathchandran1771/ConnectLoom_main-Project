import {apiSlice}  from '../api/apiSlice';
const Server_URL = 'http://localhost:5000/admin/';



export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}adminLogin`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "POST",
      }),
    }),
    getDataPosted: builder.mutation({
      query: () => ({
        url: `${Server_URL}userData`,
        method: "GET",
      }),
    }),
  }),
});
  
export const { useAdminLoginMutation,useGetDataPostedMutation, useLogoutMutation } = adminApiSlice;

  