import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import config from "@/config/config";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  () => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn("We got a rejected action!");
      const { data } = action.payload as {
        data: { code: number; message: string };
      };
      if (data?.code === 401 && data?.message === "Please authenticate") {
        toast.error(data?.message);
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }
    return next(action);
  };

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: `${config.apiUrl}`,
  prepareHeaders: (headers) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    // const store = getState() as RootState;
    const token = localStorage.getItem("access_token");
    const storedCurrency = localStorage.getItem("currency");
    const storedCountry = localStorage.getItem("country");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Currency", `${storedCurrency}`);
      headers.set("lang", `${storedCountry}`);
    }
    return headers;
  },
});

// const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
const API = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: "splitApi",
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
      // localStorage.clear();
    }
    return result;
  },
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: [
    "roles",
    "permissions",
    "permission-details",
    "Users",
    "topics",
    "chat",
    "Admin-User",
    "reviews"
  ],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({}),
});

// Enhance api for caching
export const enhancedApi = API.enhanceEndpoints({
  addTagTypes: ["Auth"],
});

export default API;
