import { createSlice } from "@reduxjs/toolkit";

export const lottery = createSlice({
  name: "lottery",
  initialState: {
    lotteryTabs: [
      {
        name: "active",
        badgeCount: "0",
        isActive: true,
      },
      {
        name: "drafts",
        badgeCount: "0",
        isActive: false,
      },
      {
        name: "pending",
        badgeCount: "0",
        isActive: false,
      },
      {
        name: "completed",
        badgeCount: "0",
        isActive: false,
      },
      {
        name: "declined",
        badgeCount: "0",
        isActive: false,
      },
    ],
  },
  reducers: {
    updateLotteryTab: (state, action) => {
      state.lotteryTabs = action.payload;
    },
  },
});

export const { updateLotteryTab } = lottery.actions;
export default lottery.reducer;
