"use client";

import Products from "../components/Products";
import { useTheme } from "../context/ThemeContext";

export default function ProductsPage() {
  const { theme } = useTheme();

  return (
    <main
      className={`min-h-screen p-4 sm:p-6 md:p-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="mx-auto max-w-7xl">
        <h1
          className={`mb-8 text-center text-3xl font-bold sm:text-4xl md:text-5xl ${theme === "dark" ? "text-gray-50" : "text-gray-900"}`}
        >
          Our Products
        </h1>
        <Products />
      </div>
    </main>
  );
}
