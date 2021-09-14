import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  items: [],
};
const CatalogSlice = createSlice({
  name: "catalogs",
  initialState: initialValue,
  reducers: {
    updateCatalogs(state, action) {
      state.items = action.payload;
    },
  },
});

export const CatalogActions = CatalogSlice.actions;
export default CatalogSlice;
