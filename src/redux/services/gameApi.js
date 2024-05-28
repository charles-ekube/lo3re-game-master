import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery,
  tagTypes: ["games", "draftGames"],
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
    fetchDraftGames: builder.query({
      query: () => `/games/draft`,
      providesTags: ["draftGames"],
      transformResponse: (results) => results.data,
    }),
    fetchSingleDraftGame: builder.query({
      query: (gid) => `/games/draft/${gid}`,
      transformResponse: (results) => results.data,
    }),
    draftAGame: builder.mutation({
      query: (body) => ({
        url: `/games/draft`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["draftGames"],
    }),
    updateDraftGame: builder.mutation({
      query: (body) => ({
        url: `/games/draft/${body.gid}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["draftGames"],
    }),
    deleteDraftGame: builder.mutation({
      query: (gid) => ({
        url: `/games/draft/${gid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["draftGames"],
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
  useFetchDraftGamesQuery,
  useFetchSingleDraftGameQuery,
  useDraftAGameMutation,
  useUpdateDraftGameMutation,
  useDeleteDraftGameMutation,
} = gameApi;
