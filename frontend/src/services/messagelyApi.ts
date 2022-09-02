import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { socket } from "../socket";
import { IAuthUser, IChat, IMessage, IUser, IAuthData } from "../types";

interface CustomError {
  data: {
    message: string;
    stack: string;
  };
  status?: string;
}

interface IMessageQuery {
  messages: Partial<IMessage>[];
  hasMoreData: boolean;
  chatId: string;
  date: string;
  userId: string;
}

interface ICreateChat {
  userId: string;
  chatName?: "sender";
}

interface ISendMessage {
  chatId: string;
  content: string;
}

interface IImageKitAuthParams {
  token: string;
  signature: string;
  expire: string;
}

export const messagelyApi = createApi({
  reducerPath: "messagelyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders(headers, api) {
      if (api.endpoint == "uploadPic") return headers;
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }) as BaseQueryFn<string | FetchArgs, unknown, CustomError, {}>,
  tagTypes: ["message", "ImageKitAuth", "User", "GroupChat", "createChat"],
  endpoints: (builder) => ({
    signIn: builder.mutation<IAuthData, IAuthUser>({
      query: (userDetails) => ({
        method: "POST",
        url: "/signin",
        body: userDetails,
      }),
    }),

    signUp: builder.mutation<IAuthData, IAuthUser>({
      query: (userDetails) => ({
        method: "POST",
        url: "/signup",
        body: userDetails,
      }),
    }),

    getUsers: builder.query<IUser[], void>({
      query: () => ({
        method: "GET",
        url: "users",
      }),
      providesTags: ["createChat"],
    }),

    createChat: builder.mutation<IChat, ICreateChat>({
      query: (arg) => ({
        method: "POST",
        url: "/chats/access",
        body: arg,
      }),
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            messagelyApi.util.updateQueryData(
              "getAllChats",
              undefined,
              (draft) => {
                draft.push(data);
              }
            )
          );
        } catch {}
      },
    }),

    authUser: builder.query<IUser, string | null>({
      query: (token) => `authenticate?token=${token}`,
      providesTags: ["User"],
    }),

    getAllChats: builder.query<IChat[], void>({
      query: () => {
        return {
          method: "GET",
          url: "/chats/all",
        };
      },
      providesTags: ["GroupChat"],
    }),

    sendMessage: builder.mutation<IMessage, ISendMessage>({
      query: (arg) => ({
        method: "POST",
        url: "/message",
        body: arg,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        if (!args) return;
        const { data } = await queryFulfilled;
        socket.emit("new message", data);
      },
    }),

    getImagekitAuthParams: builder.query<IImageKitAuthParams, void>({
      keepUnusedDataFor: 300,
      query: () => `/imagekit/auth`,
      providesTags: ["ImageKitAuth"],
    }),

    profilePic: builder.mutation({
      query: (arg) => ({
        method: "POST",
        url: "/user/profilepic",
        body: arg,
      }),
      invalidatesTags: ["User"],
    }),

    uploadPic: builder.mutation({
      query: (arg) => ({
        url: "https://upload.imagekit.io/api/v1/files/upload",
        method: "POST",
        body: arg,
      }),
      invalidatesTags: ["ImageKitAuth"],
    }),

    changeUsername: builder.mutation({
      query: (arg) => ({
        method: "POST",
        url: "/changeusername",
        body: arg,
      }),
      invalidatesTags: ["User"],
    }),

    createGroupChat: builder.mutation({
      query: (arg) => ({
        method: "POST",
        url: "/chats/group",
        body: arg,
      }),
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            messagelyApi.util.updateQueryData(
              "getAllChats",
              undefined,
              (draft) => {
                draft.push(data);
              }
            )
          );
        } catch {}
      },
    }),
    updateGroupChat: builder.mutation({
      query: (arg) => ({
        method: "POST",
        url: "/chats/group/update",
        body: arg,
      }),
      invalidatesTags: ["GroupChat"],
    }),

    getMessages: builder.query<IMessageQuery, { chatId: string; date: string }>(
      {
        query: (data) => {
          return {
            method: "GET",
            url: `/message/${data.chatId}`,
            params: { date: data.date },
          };
        },
      }
    ),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useGetUsersQuery,
  useCreateChatMutation,
  useAuthUserQuery,
  useGetAllChatsQuery,
  useSendMessageMutation,
  useGetImagekitAuthParamsQuery,
  useProfilePicMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useLazyGetImagekitAuthParamsQuery,
  useChangeUsernameMutation,
  useUploadPicMutation,
  useCreateGroupChatMutation,
  useUpdateGroupChatMutation,
  useLazyGetAllChatsQuery,
} = messagelyApi;
