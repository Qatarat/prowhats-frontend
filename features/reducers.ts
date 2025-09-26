import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import API from "@/lib/store/services/api";

const rootReducer = combineReducers({
  auth: authReducer,

  [API.reducerPath]: API.reducer,
});

export default rootReducer;
