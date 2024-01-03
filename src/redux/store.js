import {
  configureStore,
  // getDefaultMiddleware
} from "@reduxjs/toolkit";
import generalReducer from "./features/generalSlice";
import { accountApi } from "./services/accountApi";
import { beneficiariesApi } from "./services/beneficiariesApi";
import { lotteryApi } from "./services/lotteryApi";
import { twoFAApi } from "./services/twoFAApi";
import { walletApi } from "./services/walletApi";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [twoFAApi.reducerPath]: twoFAApi.reducer,
    [beneficiariesApi.reducerPath]: beneficiariesApi.reducer,
    [lotteryApi.reducerPath]: lotteryApi.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      //   authApi.middleware,
      accountApi.middleware,
      walletApi.middleware,
      twoFAApi.middleware,
      beneficiariesApi.middleware,
      lotteryApi.middleware,
    ]),
});
