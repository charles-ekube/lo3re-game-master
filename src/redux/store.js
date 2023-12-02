import {
  configureStore,
  // getDefaultMiddleware
} from "@reduxjs/toolkit";
import generalReducer from "./features/generalSlice";

export const store = configureStore({
  reducer: {
    general: generalReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      //   authApi.middleware,
    ]),
});
