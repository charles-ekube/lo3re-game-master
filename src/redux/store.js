import {
  configureStore,
  // getDefaultMiddleware
} from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import generalReducer from "./features/generalSlice";
import lotteryReducer from "./features/lotterySlice";
import { accountApi } from "./services/accountApi";
import { beneficiariesApi } from "./services/beneficiariesApi";
import { gameApi } from "./services/gameApi";
import { twoFAApi } from "./services/twoFAApi";
import { walletApi } from "./services/walletApi";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    auth: authReducer,
    lottery: lotteryReducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [twoFAApi.reducerPath]: twoFAApi.reducer,
    [beneficiariesApi.reducerPath]: beneficiariesApi.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
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
      gameApi.middleware,
    ]),
});
