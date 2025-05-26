"use client";

import Products from "../components/Products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Our Products</h1>
      <div className="mx-auto max-w-7xl">
        <Products />
      </div>
    </main>
  );
}
