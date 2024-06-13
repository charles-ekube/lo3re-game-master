import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery,
  tagTypes: ["balance", "transactions"],
  endpoints: (builder) => ({
    fetchWalletBalance: builder.query({
      query: () => `/wallets`,
      providesTags: ["balance"],
      transformResponse: (results) => results.data,
    }),
    fetchTransactions: builder.query({
      query: (query) => `/wallets/transactions${query ? "?" + query : ""}`,
      providesTags: ["transactions"],
      transformResponse: (results) => results.data,
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
      invalidatesTags: ["transactions", "balance"],
    }),
    requestDeposit: builder.mutation({
      query: (data) => ({
        url: `wallets/deposits`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["transactions"],
    }),
    fetchSupportedBanks: builder.query({
      query: () => `/wallets/supported-banks`,
      providesTags: ["balance"],
      transformResponse: (results) => results.data,
    }),
    fetchSupportedCryptos: builder.query({
      query: () => `/wallets/supported-coins`,
    }),
  }),
});

export const {
  useFetchWalletBalanceQuery,
  useActivateWalletPinMutation,
  useUpdateWalletPinMutation,
  useCheckWalletPinMutation,
  useRequestWithdrawalMutation,
  useFetchTransactionsQuery,
  useFetchSupportedBanksQuery,
  useFetchSupportedCryptosQuery,
  useRequestDepositMutation,
} = walletApi;
