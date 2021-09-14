import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  account: {
    customerId: "",
    firstName: "",
    lastName: "",
    email: "",
    phNo: "",
    roles: "",
  },
  addresses: [],
  orders: [],
};
const AccountSlice = createSlice({
  name: "account",
  initialState: initialValue,
  reducers: {
    storeAccountData(state, action) {
      state.account = action.payload;
    },
    storeAddresses(state, action) {
      state.addresses = action.payload;
    },
    refreshData(state, action) {
      state.account = initialValue.account;
      state.addresses = initialValue.addresses;
      state.orders = initialValue.orders;
    },
    storeOrders(state, action) {
      state.orders = action.payload;
    },
  },
});

export const AccountSliceActions = AccountSlice.actions;
export default AccountSlice;
