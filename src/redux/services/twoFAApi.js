import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const twoFAApi = createApi({
  reducerPath: "twoFAApi",
  baseQuery,
  endpoints: (builder) => ({
    requestTFA: builder.query({
      query: () => `/auth/2fa`,
      transformResponse: (results) => results.data,
    }),
    activateTFA: builder.mutation({
      query: (data) => ({
        url: `auth/2fa/activate`,
        method: "POST",
        body: data,
      }),
    }),
    deactivateTFA: builder.mutation({
      query: (data) => ({
        url: `auth/2fa/deactivate`,
        method: "POST",
        body: data,
      }),
    }),
    verifyTFA: builder.mutation({
      query: (data) => ({
        url: `auth/2fa`,
        method: "POST",
        body: data,
      }),
    }),
    activateEmailMFA: builder.mutation({
      query: (data) => ({
        url: `auth/mfa/email/activate`,
        method: "POST",
        body: data,
      }),
    }),
    deactivateEmailMFA: builder.mutation({
      query: (data) => ({
        url: `auth/mfa/email/deactivate`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRequestTFAQuery,
  useActivateTFAMutation,
  useDeactivateTFAMutation,
  useActivateEmailMFAMutation,
  useDeactivateEmailMFAMutation,
  useVerifyTFAMutation,
} = twoFAApi;
