import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import loadingReducer from "./slices/loadingSlice";

const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      loading: loadingReducer,
    },
  });
};

// Create store instance
export const store = makeStore();

// Types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
