import {
  configureStore,
  // getDefaultMiddleware
} from "@reduxjs/toolkit";
import generalReducer from "./features/generalSlice";
import { accountApi } from "./services/accountApi";
import { walletApi } from "./services/walletApi";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      //   authApi.middleware,
      accountApi.middleware,
      walletApi.middleware,
    ]),
});
