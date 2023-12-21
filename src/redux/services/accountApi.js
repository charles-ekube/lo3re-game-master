import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery,
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    fetchProfile: builder.query({
      query: () => `/user`,
      providesTags: ["profile"],
      transformResponse: (results) => results.data,
    }),
  }),
});

export const { useFetchProfileQuery } = accountApi;
