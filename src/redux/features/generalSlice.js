import { createSlice } from "@reduxjs/toolkit";

// TODO: persist user detail



const localLotteryForm = JSON.parse(localStorage.getItem("lotteryForm") || "{}");

export const general = createSlice({
  name: "general",
  initialState: {
    showSidebar: false,
    userDetail: {},
    addLotteryForm: Object.keys(localLotteryForm).length ? localLotteryForm : {},
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    updateUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
    updateAddLotteryForm: (state, action) => {
      state.addLotteryForm = action.payload;
      localStorage.setItem("lotteryForm", JSON.stringify(action.payload));
    },
  },
});

export const { toggleSidebar, updateUserDetail, updateAddLotteryForm } =
  general.actions;
export default general.reducer;
