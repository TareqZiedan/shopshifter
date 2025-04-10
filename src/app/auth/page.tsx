"use client";

import React, { useState } from "react";

type AuthMode = "login" | "signup";

const AuthCard = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !form.name.trim()) return;

    // Fake auth success
    setUser({ name: form.name || "Demo User", email: form.email });
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false);
    setForm({ name: "", email: "", password: "" });
    setMode("login");
  };

  if (loggedIn && user) {
    return (
      <div className="w-full max-w-sm rounded-lg border p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Welcome, {user.name}!</h2>
        <p className="mb-2 text-gray-600">Email: {user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-lg border p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        {mode === "signup" && (
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full rounded border px-3 py-2"
            value={form.name}
            onChange={handleChange}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full rounded border px-3 py-2"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          className="text-blue-600 underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
};

export default AuthCard;
