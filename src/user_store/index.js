import { configureStore } from "@reduxjs/toolkit";
import AccountSlice from "./AccountSlice";
import CartSlice from "./CartSlice";
import CatalogSlice from "./CatalogSlice.js";
import FeedSlice from "./FeedSlice";
import LoadingBarSlice from "./LoadingBarSlice";
const store = configureStore({
  reducer: {
    cart: CartSlice.reducer,
    catalog: CatalogSlice.reducer,
    feeds: FeedSlice.reducer,
    loadingStatusBar: LoadingBarSlice.reducer,
    account: AccountSlice.reducer,
  },
});

export default store;
