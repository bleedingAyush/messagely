import { configureStore } from "@reduxjs/toolkit";
import { messagelyApi } from "../services/messagelyApi";
import messageReducer from "./messageSlice";
import dateReducer from "./dateSlice";

export const store = configureStore({
  reducer: {
    messages: messageReducer,
    date: dateReducer,
    [messagelyApi.reducerPath]: messagelyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messagelyApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
