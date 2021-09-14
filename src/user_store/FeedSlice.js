import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  items: [],
};
const FeedSlice = createSlice({
  name: "feed",
  initialState: initialValue,
  reducers: {
    updateProducts(state, action) {
      state.items = action.payload;
    },
  },
});
export const FeedSliceActions = FeedSlice.actions;
export default FeedSlice;
