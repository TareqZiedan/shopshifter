"use client";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useEffect } from "react";
import { login } from "./redux/slices/authSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
    // For demo: support multiple users in localStorage as 'demoUsers'
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("demoUsers");
      if (cached) {
        const users = JSON.parse(cached);
        if (Array.isArray(users) && users.length > 0 && users[0].email) {
          store.dispatch(login(users[0].email));
        }
      }
    }
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
