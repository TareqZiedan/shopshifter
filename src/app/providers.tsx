"use client";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useEffect, useState } from "react";
import { login, loadUser } from "./redux/slices/authSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // First try to load any existing user session
    store.dispatch(loadUser());

    // Then check for demo users
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("demoUsers");
      if (cached) {
        try {
          const users = JSON.parse(cached);
          if (Array.isArray(users) && users.length > 0 && users[0].email) {
            // Only login if there isn't already a user session
            const currentUser = localStorage.getItem("user");
            if (!currentUser) {
              store.dispatch(login(users[0].email));
            }
          }
        } catch (error) {
          console.error("Error loading demo users:", error);
        }
      }
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return <Provider store={store}>{children}</Provider>;
}
