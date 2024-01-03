import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./customFetchBase";

export const lotteryApi = createApi({
  reducerPath: "lotteryApi",
  baseQuery,
  tagTypes: ["lotteries"],
  endpoints: (builder) => ({
    createLottery: builder.mutation({
      query: (data) => ({
        url: `games`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateLotteryMutation } = lotteryApi;
