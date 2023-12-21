import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { showError } from "../../utils/Alert";
// import { logout } from "../features/authSlice";

const baseUrl = "https://us-central1-lo3re-ee26a.cloudfunctions.net/api/";

const base = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("accessToken");

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
    result.error?.data?.message === "invalid jwt token provided"
  ) {
    showError("Session expired");
    // redirect("/login");
    // api.dispatch(logout());
    // window.location.replace("/login");
  }
  return result;
};

export default baseQuery;
