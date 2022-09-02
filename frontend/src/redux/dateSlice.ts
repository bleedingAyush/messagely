import { createSlice, createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState: any = {
  date: null,
  lastItemDate: { chatId: null, date: "none" },
};

export const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    addDate: (state, action) => {
      if (state.date != action.payload) state.date = action.payload;
    },
    lastItemDate: (state, action) => {
      const { chatId, date } = action.payload;
      const lastItemDate = state.lastItemDate;
      if (lastItemDate.date != date) state.lastItemDate = { ...action.payload }; // could lead to bugs
    },
  },
});

export const { addDate, lastItemDate } = dateSlice.actions;

export default dateSlice.reducer;

export const getDatetime = createDraftSafeSelector(
  (state: RootState) => state.date,
  (items) => {
    return items;
  }
);
