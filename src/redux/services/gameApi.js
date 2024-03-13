import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery,
  tagTypes: ["games"],
  endpoints: (builder) => ({
    fetchGames: builder.query({
      query: () => `/games`,
      providesTags: ["games"],
      transformResponse: (results) => results.data,
    }),
    createGame: builder.mutation({
      query: (data) => ({
        url: `/games`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useFetchGamesQuery, useCreateGameMutation } = gameApi;
