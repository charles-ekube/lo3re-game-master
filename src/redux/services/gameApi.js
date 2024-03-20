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
    fetchSingleGame: builder.query({
      query: (gid) => `/games/${gid}`,
      transformResponse: (results) => results.data,
    }),
    fetchGameTickets: builder.query({
      query: (gid) => `/games/${gid}/tickets`,
      transformResponse: (results) => results.data,
    }),
    fetchLeaderBoard: builder.query({
      query: (gid) => `/games/${gid}/leaderboard`,
      transformResponse: (results) => results.data,
    }),
    createGame: builder.mutation({
      query: (data) => ({
        url: `/games`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["games"],
    }),
    updateGame: builder.mutation({
      query: (data) => ({
        url: `/games/${data.gid}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["games"],
    }),
    deleteGame: builder.mutation({
      query: (gid) => ({
        url: `/games/${gid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["games"],
    }),
  }),
});

export const {
  useFetchGamesQuery,
  useFetchGameTicketsQuery,
  useFetchLeaderBoardQuery,
  useFetchSingleGameQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
} = gameApi;
