import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const beneficiariesApi = createApi({
  reducerPath: "beneficiariesApi",
  baseQuery,
  tagTypes: ["bankBene", "cryptoBene"],
  endpoints: (builder) => ({
    fetchBankBeneficiaries: builder.query({
      query: () => `/wallets/withdrawals/bank-details`,
      providesTags: ["bankBene"],
      transformResponse: (results) => results.data,
    }),
    fetchCryptoBeneficiaries: builder.query({
      query: () => `/wallets/withdrawals/crypto`,
      providesTags: ["cryptoBene"],
      transformResponse: (results) => results.data,
    }),
    fetchSupportedBanks: builder.query({
      query: () => `/wallets/supported-banks`,
      transformResponse: (results) => results.data,
    }),
    fetchSupportedCoins: builder.query({
      query: () => `/wallets/supported-coins`,
      transformResponse: (results) => results,
    }),
    validateAccountDetail: builder.mutation({
      query: (data) => ({
        url: `wallets/withdrawals/validate-bank-details?currency=ngn`,
        method: "POST",
        body: data,
      }),
    }),
    addBankBeneficiary: builder.mutation({
      query: (data) => ({
        url: `wallets/withdrawals/bank-details`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bankBene"],
    }),
    deleteBankBeneficiary: builder.mutation({
      query: (id) => ({
        url: `wallets/withdrawals/bank-details/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["bankBene"],
    }),
    updateBankBeneficiary: builder.mutation({
      query: (data) => ({
        url: `wallets/withdrawals/bank-details/${data.id}`,
        method: "PUT",
        body: data.data,
      }),
      invalidatesTags: ["bankBene"],
    }),
    addCryptoBeneficiary: builder.mutation({
      query: (data) => ({
        url: `wallets/withdrawals/crypto`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cryptoBene"],
    }),
    updateCryptoBeneficiary: builder.mutation({
      query: (data) => ({
        url: `wallets/withdrawals/crypto/${data.id}`,
        method: "PUT",
        body: data.data,
      }),
      invalidatesTags: ["cryptoBene"],
    }),
    deleteCryptoBeneficiary: builder.mutation({
      query: (id) => ({
        url: `wallets/withdrawals/crypto/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cryptoBene"],
    }),
  }),
});

export const {
  useFetchBankBeneficiariesQuery,
  useFetchCryptoBeneficiariesQuery,
  useAddBankBeneficiaryMutation,
  useDeleteBankBeneficiaryMutation,
  useUpdateBankBeneficiaryMutation,
  useAddCryptoBeneficiaryMutation,
  useUpdateCryptoBeneficiaryMutation,
  useDeleteCryptoBeneficiaryMutation,
  useFetchSupportedBanksQuery,
  useFetchSupportedCoinsQuery,
  useValidateAccountDetailMutation,
} = beneficiariesApi;
