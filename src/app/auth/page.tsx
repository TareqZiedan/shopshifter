"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  login as reduxLogin,
  logout as reduxLogout,
} from "../redux/slices/authSlice";

type AuthMode = "login" | "signup";

// TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
// User type for cache
interface User {
  name: string;
  email: string;
  password: string;
}

// TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
// Utility functions for multi-user cache
function getCachedUsers(): User[] {
  if (typeof window === "undefined") return [];
  const cached = localStorage.getItem("demoUsers");
  return cached ? (JSON.parse(cached) as User[]) : [];
}
function setCachedUsers(users: User[]): void {
  localStorage.setItem("demoUsers", JSON.stringify(users));
}
function deleteCachedUser(email: string): void {
  const users = getCachedUsers();
  const filtered = users.filter((u: User) => u.email !== email);
  setCachedUsers(filtered);
}

const AuthCard = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Email regex for basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    if (mode === "signup" && !form.name.trim()) {
      return "Name is required.";
    }
    if (!form.email.trim()) {
      return "Email is required.";
    }
    if (!emailRegex.test(form.email)) {
      return "Invalid email address.";
    }
    if (!form.password) {
      return "Password is required.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      // TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
      // --- BEGIN MULTI-USER CACHE AUTH LOGIC ---
      if (mode === "login") {
        const users = getCachedUsers();
        const found = users.find(
          (u: User) => u.email === form.email && u.password === form.password,
        );
        if (found) {
          setUser({ name: found.name, email: found.email });
          setLoggedIn(true);
          dispatch(reduxLogin(found.email));
          router.push("/");
        } else {
          throw new Error("Invalid email or password");
        }
      } else {
        const users = getCachedUsers();
        if (users.some((u: User) => u.email === form.email)) {
          throw new Error("Email already registered");
        }
        const newUser: User = {
          name: form.name,
          email: form.email,
          password: form.password, // Only for demo/testing! Never store plain passwords in real apps!
        };
        users.push(newUser);
        setCachedUsers(users);
        setUser({ name: newUser.name, email: newUser.email });
        setLoggedIn(true);
        dispatch(reduxLogin(newUser.email));
        router.push("/");
      }
      // --- END MULTI-USER CACHE AUTH LOGIC ---
      // TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
      setForm((f) => ({ ...f, password: "" }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false);
    setForm({ name: "", email: "", password: "" });
    setMode("login");
    setError(null);
    dispatch(reduxLogout());
    // TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
    // No need to remove users from cache on logout
  };

  if (loggedIn && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Welcome, {user.name}!
          </h2>
          <p className="mb-2 text-gray-300">Email: {user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-white">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "signup" && (
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          {error && (
            <div className="rounded bg-red-700 px-3 py-2 text-sm text-white">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
                ? "Login"
                : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            className="text-blue-400 underline hover:text-blue-300"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}
            disabled={loading}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

// TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
export { deleteCachedUser };
export default AuthCard;
