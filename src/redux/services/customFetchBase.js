import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { showError } from "../../utils/Alert";
import { setIsTokenRequested, updateAccessToken } from "../features/authSlice";
import { logOutUser } from "../features/authSlice";

const baseUrl = "https://us-central1-lo3re-ee26a.cloudfunctions.net/api/";

function waitForAuthState() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        // User is signed in
        resolve(user);
      } else {
        // No user is signed in
        reject(new Error("No user signed in"));
      }
    });
  });
}

const base = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // const token = localStorage.getItem("accessToken");
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const token = api.getState().auth.accessToken;
  if (!token) {
    try {
      const user = await waitForAuthState();
      api.dispatch(updateAccessToken(user?.accessToken));
      api.dispatch(setIsTokenRequested(true));
    } catch (error) {
      console.log("fetch token err", error);
      api.dispatch(setIsTokenRequested(true));
    }
  }

  let result = await base(args, api, extraOptions);
  if (
    result.error &&
    // @ts-ignore
    result?.error?.status === 401
  ) {
    showError("Session expired");

    api.dispatch(logOutUser({}));
  }
  return result;
};

export default baseQuery;
