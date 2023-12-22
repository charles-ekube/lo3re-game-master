import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery,
  tagTypes: ["balance"],
  endpoints: (builder) => ({
    fetchWalletBalance: builder.query({
      query: () => `/wallets`,
      providesTags: ["balance"],
      // transformResponse: (results: { data: { user: UserDetail } }) =>
      //   results.data.user,
    }),
    activateWalletPin: builder.mutation({
      query: (data) => ({
        url: `/auth/wallet/pin/new`,
        method: "POST",
        body: data,
      }),
    }),
    updateWalletPin: builder.mutation({
      query: (data) => ({
        url: `auth/wallet/pin/update`,
        method: "POST",
        body: data,
      }),
    }),
    checkWalletPin: builder.mutation({
      query: (data) => ({
        url: `auth/wallet/pin`,
        method: "POST",
        body: data,
      }),
    }),
    requestWithdrawal: builder.mutation({
      query: (data) => ({
        url: `wallets/withdrawals`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchWalletBalanceQuery,
  useActivateWalletPinMutation,
  useUpdateWalletPinMutation,
  useCheckWalletPinMutation,
  useRequestWithdrawalMutation,
} = walletApi;
