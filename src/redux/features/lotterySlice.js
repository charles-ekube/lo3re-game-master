import { createSlice } from "@reduxjs/toolkit";

export const lottery = createSlice({
  name: "lottery",
  initialState: {
    lotteryTabs: [
      {
        name: "active",
        label: "live",
        badgeCount: "0",
        isActive: true,
      },
      {
        name: "drafts",
        label: "drafts",
        badgeCount: "0",
        isActive: false,
      },
      {
        name: "pending",
        label: "pending",
        badgeCount: "0",
        isActive: false,
      },
      {
        name: "completed",
        label: "completed",
        badgeCount: "0",
        isActive: false,
      },
      {
        name: "declined",
        label: "declined",
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
