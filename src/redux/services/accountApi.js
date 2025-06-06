import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery,
  tagTypes: ["profile", "bankBene", "cryptoBene"],
  endpoints: (builder) => ({
    fetchProfile: builder.query({
      query: () => `/user`,
      providesTags: ["profile"],
      transformResponse: (results) => results.data,
    }),
    fetchFollowers: builder.query({
      query: () => `/followers`,
      transformResponse: (results) => results.data,
    }),
    fetchUniquePlayers: builder.query({
      query: () => `/unique-players`,
      transformResponse: (results) => results.data,
    }),
    fetchReferrals: builder.query({
      query: () => `/referrals`,
      transformResponse: (results) => results.data,
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `auth/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchProfileQuery,
  useFetchFollowersQuery,
  useFetchUniquePlayersQuery,
  useResetPasswordMutation,
  useFetchReferralsQuery,
} = accountApi;
