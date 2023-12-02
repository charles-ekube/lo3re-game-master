import { createSlice } from "@reduxjs/toolkit";

export const general = createSlice({
  name: "general",
  initialState: {
    showSidebar: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const { toggleSidebar } = general.actions;
export default general.reducer;
