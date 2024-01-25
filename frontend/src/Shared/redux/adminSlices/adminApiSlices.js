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
    getPremiumUser: builder.mutation({
      query: () => ({
        url: `${Server_URL}get-premiumUsers`,
        method: "GET",
      }),
    }),
    getAllUsers: builder.mutation({
      query: () => ({
        url: `${Server_URL}userData`,
        method: "GET",
      }),
    }),
    getUploadedAd: builder.mutation({
      query: () => ({
        url: `${Server_URL}get-ad`,
        method: "GET",
      }),
    }),
    getUploadedAdToUser: builder.mutation({
      query: () => ({
        url: `${Server_URL}get-adToUser`,
        method: "GET",
      }),
    }),
    deleteAdPost: builder.mutation({
      query: ({postId }) => ({
        url: `${Server_URL}Delete-ad/${postId}`,
        method: "DELETE",
      }),
    }),

    editAdPost: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}edit-AdPost`,
        method: "PATCH",
        body: data,
      }),
    }), 

  }),
});
  
export const { 
  useAdminLoginMutation,
  useGetDataPostedMutation, 
  useLogoutMutation ,
  useGetPremiumUserMutation,
  useGetAllUsersMutation,
  useGetUploadedAdMutation,
  useGetUploadedAdToUserMutation,
  useDeleteAdPostMutation,
  useEditAdPostMutation,

} = adminApiSlice;

  