import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  loadingStatus: false,
};
const LoadingBarSlice = createSlice({
  name: "loadingBar",
  initialState: initialValue,
  reducers: {
    updateStatusBar(state, action) {
      state.loadingStatus = action.payload;
    },
  },
});

export const LoadingBarSliceActions = LoadingBarSlice.actions;
export default LoadingBarSlice;
