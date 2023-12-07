import { createSlice } from "@reduxjs/toolkit";

export const general = createSlice({
  name: "general",
  initialState: {
    showSidebar: false,
    userDetail: {},
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    updateUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
  },
});

export const { toggleSidebar, updateUserDetail } = general.actions;
export default general.reducer;
