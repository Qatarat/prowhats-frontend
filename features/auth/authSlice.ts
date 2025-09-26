// src/features/auth/authSlice.ts

import {
  GeustResponse,
  UserApiResponse,
  UserResponse,
  UserSettingsResposne,
} from "@/types/auth/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  phoneNumber: string | null;
  otp: string | null;
  user: UserApiResponse | null;
  admin: UserApiResponse | null;
  guest: GeustResponse | null;
  userLoading: boolean;
  userInfo: UserSettingsResposne | null;
}

const initialState: AuthState = {
  phoneNumber: null,
  otp: null,
  user: null,
  admin: null,
  userLoading: true,
  guest: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getPhoneNumber(state, action: PayloadAction<string | null>) {
      state.phoneNumber = action.payload;
    },
    getOtp(state, action: PayloadAction<string | null>) {
      state.otp = action.payload;
    },
    getUser(state, action: PayloadAction<UserApiResponse>) {
      state.user = action.payload;
      state.userLoading = false;
    },

    getUserInfo(state, action: PayloadAction<UserSettingsResposne>) {
      state.userInfo = action.payload;
    },
    getGuestUser(state, action: PayloadAction<GeustResponse>) {
      state.guest = action.payload;
      state.userLoading = false;
    },
    setUserLoading(state, action: PayloadAction<boolean>) {
      state.userLoading = action.payload;
    },
  },
});

export const authAction = authSlice.actions;

export default authSlice.reducer;
