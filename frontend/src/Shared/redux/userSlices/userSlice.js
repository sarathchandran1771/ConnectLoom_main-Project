// src/user/redux/slices/userSlice.js

import  {apiSlice}  from '../api/apiSlice';
const Server_URL = process.env.REACT_APP_BACKEND_BASEURL;

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
    getProfileData: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/profile/${data.userId}`,
        method: "GET",
      }),
    }),

    getAllUserData: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/allUsers`,
        method: "GET",
        params: data,
      }),
    }),

    getAllFriendsData: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/getFriends`,
        method: "GET",
        params: data,
      }),
    }),

    getNotifiedData: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/notify/${data.notifyId}`,
        method: "GET",
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
      query: (data) => ({
        url: `${Server_URL}/post/all-posts`,
        method: "GET",
      }),
    }),

    getDataPosted: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/dataPosted`,
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
        url: `${Server_URL}/post/reportPost`,
        method: "PATCH",
          body: data
      }),
    }),
    deletePost: builder.mutation({
      query: ({postId }) => ({
        url: `${Server_URL}/post/deletePosts/${postId}`,
        method: "DELETE",
      }),
    }),    
    archivePost: builder.mutation({
      query: ({postId }) => ({
        url: `${Server_URL}/post/archivePost/${postId}`,
        method: "PATCH",
      }),
    }), 
    getArchivePost: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/getArchivePost/${data.userId}`, 
        method: "GET",
      }),
    }),

    savePost: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/savePost`,
        method: "POST",
        body: data,
      }),
    }),

    reportOnComment: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/report-Comment`,
        method: "POST",
        body: data,
      }),
    }),

    getSavedPost: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/getSavedPost`,
        method: "GET",
        params: data,
      }),
    }),
    likeOnPost: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/postLike?postId=${data.postId}`,
        method: "POST",
        body: { userId: data.userId },
      }),
    }), 
    commentOnPost: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/post-Comment`,
        method: "POST",
        body: data, 
      }),
    }), 
    getComments: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/get-Comment?postId=${data.postId}&userId=${data.userId}`,
        method: "GET",
      }),
    }),
    
    deleteComment: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/post/delete-Comment`,
        method: "POST",
        body: data,
      }),
    }),
    
    postFollowRequest: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/send-request`,
        method: "POST",
        body: data, 
      }),
    }), 

    getPendingRequest: builder.mutation({
      query: ({fromUserId,toUserId}) => ({
        url: `${Server_URL}/pending-request`,
        method: "GET",
        params:{
          fromUserId,
          toUserId
        },
      }),
    }),

    respondFollowRequest: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/respond-request`,
        method: "POST",
        body: data, 
      }),
    }), 

    getfollowersData: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/getFollowers/${data.userId}`,
        method: "GET",
      }),
    }),
    getfollowingsData: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/getFollowing/${data.userId}`,
        method: "GET",
      }),
    }),
    
    checkUserBlockedStatus: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/check-and-logout`,
        method: "POST",
        body: { userId: data.userId }, 
      }),
    }), 

    getMessage: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/search-users?searchQuery=${data.userId}`,
        method: "GET",
      }),
    }),

    createNotification: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/notifications`,
        method: "POST",
        body: data, 
      }),
    }), 


    getNotefications: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/notifications/unread/${data.userId}`,
        method: "GET",
      }),
    }),

    getChatUsers: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/getChatUsers/${data.userId}`,
        method: "GET",
      }),
    }),

    createChatRoom: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/createRoom`,
        method: "POST",
        body: data, 
      }),
    }), 

    addMessage: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/addMessage`,
        method: "POST",
        body: data, 
      }),
    }), 

    getAllMessage: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/getMessage`,
        method: "POST",
        body: data, 
      }),
    }), 

    faceBookLogin: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/facebooklogin`,
        method: "POST",
        body: data, 
      }),
    }),

    reportOnProfile: builder.mutation({
      query: (data) => ({
        url: `${Server_URL}/reportOnUserProfile`,
        method: "POST",
        body: data,
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
  useArchivePostMutation,
  useGetArchivePostMutation,
  useSavePostMutation,
  useGetSavedPostMutation,
  useLikeOnPostMutation,
  useCommentOnPostMutation,
  useGetCommentsMutation,
  usePostFollowRequestMutation,
  useCheckUserBlockedStatusMutation,
  useGetMessageMutation,
  useGetNoteficationsMutation,
  useGetChatUsersMutation,
  useAddMessageMutation,
  useGetAllMessageMutation,
  useGetPendingRequestMutation,
  useRespondFollowRequestMutation,
  useCreateChatRoomMutation,
  useCreateNotificationMutation,
  useFaceBookLoginMutation,
  useGetfollowersDataMutation,
  useGetfollowingsDataMutation,
  useGetProfileDataMutation,
  useReportOnCommentMutation,
  useDeleteCommentMutation,
  useGetNotifiedDataMutation,
  useGetAllUserDataMutation,
  useGetAllFriendsDataMutation,
  useReportOnProfileMutation,
} = userApiSlice;

