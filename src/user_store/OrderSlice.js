import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  orders: [],
};
const OrderSlice = createSlice({
  name: "cart",
  initialState: initialValue,
  reducers: {
    addAllToCart(state, action) {
      const items = action.payload;
      var amt = 0;
      for (var i = 0; i < items.length; i++) {
        state.cartitems.push({
          productId: items[i].product.productId,
          quantity: items[i].quantity,
        });
        amt += items[i].quantity * items[i].product.price;
      }

      state.cartitems = action.payload;

      state.priceitems = {
        quantity: items.length,
        amount: amt,
      };
    },
    refreshData(state, action) {
      state.cartitems = initialValue.cartitems;
      state.priceitems = initialValue.priceitems;
    },
  },
});

export const OrderSliceActions = OrderSlice.actions;
export default OrderSlice;
