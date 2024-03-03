import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { showError } from "../../utils/Alert";
import { logOutUser } from "../features/authSlice";

const baseUrl = "https://us-central1-lo3re-ee26a.cloudfunctions.net/api/";

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
