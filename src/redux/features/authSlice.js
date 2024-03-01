import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "firebase/auth";
import { auth as firebaseAuth } from "../../firebase";

export const auth = createSlice({
  name: "auth",
  initialState: {
    accessToken: "",
    isTokenRequested: false,
  },
  reducers: {
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setIsTokenRequested: (state, action) => {
      state.isTokenRequested = action.payload;
    },
    logOutUser: async (state) => {
      // state.userDetail = {};
      await signOut(firebaseAuth);
      state.accessToken = "";
      state.isTokenRequested = false;
      window.location.replace("/");
    },
  },
});

export const { updateAccessToken, setIsTokenRequested, logOutUser } =
  auth.actions;
export default auth.reducer;
