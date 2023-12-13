// ./user/utils/api.js
import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
  baseQuery:fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
});










































//const getToken = () => {
  //   const token = localStorage.getItem('accessToken');
  //   return token;
  // };
  // export const apiCall = async (credentials) => {
  //   const token = getToken();
  
  //   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  //   return new Promise(async (resolve, reject) => {
  //     if (!token) {
  //       console.error('apiCall - Authentication token not available');
  //       reject(new Error('Authentication token not available'));
  //     } else {
  //       const headers = {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       };
  //       const requestBody = credentials.credentials; // Access the actual credentials object
  //       await delay(1000);
  //       // console.log('apiCall - API call successful with credentials:', requestBody);
  //       resolve({
  //         success: true,
  //         message: 'API call successful',
  //         headers,
  //         requestBody,
  //       });
  //     }
  //   });
  // };
//  