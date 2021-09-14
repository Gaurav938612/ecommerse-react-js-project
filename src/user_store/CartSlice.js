import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  cartitems: [],
  priceitems: {
    quantity: 0,
    amount: 0,
  },
};
const CartSlice = createSlice({
  name: "cart",
  initialState: initialValue,
  reducers: {
    addToCart(state, action) {
      console.log(action.payload);
      console.log(state.cartitems);

      const index = state.cartitems.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (index >= 0) {
        state.cartitems[index].quantity =
          state.cartitems[index].quantity + action.payload.quantity;
      } else {
        state.cartitems.push(action.payload);
      }
    },
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

export const CartSliceActions = CartSlice.actions;
export default CartSlice;
