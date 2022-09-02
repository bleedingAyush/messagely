import { createDraftSafeSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState: any = {
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action: any) => {
      const { _id } = action.payload;
      const isDuplicate = state.messages
        .map((item: any) => item._id)
        .includes(_id);
      if (isDuplicate) return;
      state.messages.push(action.payload);
    },

    assignMessageId: (state, action: any) => {
      const { previousId, newId } = action.payload;

      const index = state.messages
        .map((item: any) => item._id)
        .indexOf(previousId);

      console.log("index assign id", index);

      state.messages[index]._id = newId;
    },
  },
});

export const { addMessage, assignMessageId } = messageSlice.actions;
export default messageSlice.reducer;

export const getMessages = createDraftSafeSelector(
  (state: RootState) => state.messages,
  (items) => {
    return items?.messages;
  }
);
