import API from "@/lib/store/services/api";
import { LoginPayload, LoginResponse, SendOtpPayload } from "@/types/auth/auth";
import config from "@/config/config";
import { endpoints } from "@/constants/endpoints";
import { authAction } from "./authSlice";

const authQuery = API.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    sendUserOtp: builder.mutation({
      query: (data: SendOtpPayload) => ({
        url: config.apiUrl + endpoints.user_sentOtp,
        method: "POST",
        body: data,
      }),
    }),
    sendAdminOtp: builder.mutation({
      query: (data: SendOtpPayload) => ({
        url: config.apiUrl + endpoints.admin_sentOtp,
        method: "POST",
        body: data,
      }),
    }),
    adminLogin: builder.mutation<any, any>({
      query: (data: LoginPayload) => ({
        url: config.apiUrl + endpoints.admin_verifyOtp,
        method: "POST",
        body: data,
      }),
    }),
    userLogin: builder.mutation<any, any>({
      query: (data: LoginPayload) => ({
        url: config.apiUrl + endpoints.user_verifyOtp,
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query<any, any>({
      query: () => ({
        url: config.apiUrl + endpoints.profile,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

       
          dispatch(authAction.getUser(data?.response?.user));

          // localStorage.clear();
          // // Save tokens safely
          // if (response?.accessToken) {
          //   localStorage.setItem("accessToken", response.accessToken);
          // }
          // if (response?.refreshToken) {
          //   localStorage.setItem("refreshToken", response.refreshToken);
          // }

          // console.log("Saved tokens and user data successfully");
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    }),
    getAdminProfile: builder.query<any, any>({
      query: () => ({
        url: config.apiUrl + endpoints.admin_profile,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          console.log("profile", arg);

          dispatch(authAction.getUser(data?.response?.admin));

          // localStorage.clear();
          // // Save tokens safely
          // if (response?.accessToken) {
          //   localStorage.setItem("accessToken", response.accessToken);
          // }
          // if (response?.refreshToken) {
          //   localStorage.setItem("refreshToken", response.refreshToken);
          // }

          // console.log("Saved tokens and user data successfully");
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    }),
    getContries: builder.query<any, any>({
      query: () => ({
        url: config.apiUrl + endpoints.countries,
      }),
    }),
  }),
});

export const {
  useSendUserOtpMutation,
  useSendAdminOtpMutation,
  useAdminLoginMutation,
  useUserLoginMutation,
  useGetContriesQuery,
} = authQuery;

export default authQuery;
