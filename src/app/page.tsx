"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { stopLoading } from "./redux/slices/loadingSlice";
import { useEffect } from "react";
import { useRedirect } from "./hooks/useRedirect";

export default function Home() {
  const dispatch = useDispatch();
  const { redirect } = useRedirect();

  useEffect(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-7xl px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Welcome to ShopShifter
            </h1>
            <p className="mb-8 text-xl md:text-2xl">
              Your one-stop destination for all your shopping needs
            </p>
            <button
              onClick={() => redirect("/products")}
              className="cursor-pointer rounded-full bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-90 py-16">
        <div className="mx-auto max-w-7xl px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose Us
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center">
              <div className="mb-4 text-4xl text-blue-600">🚚</div>
              <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your products delivered quickly and reliably
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="mb-4 text-4xl text-blue-600">💎</div>
              <h3 className="mb-2 text-xl font-semibold">Quality Products</h3>
              <p className="text-gray-600">
                Carefully selected items that meet our high standards
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="mb-4 text-4xl text-blue-600">🛡️</div>
              <h3 className="mb-2 text-xl font-semibold">Secure Shopping</h3>
              <p className="text-gray-600">Your security is our top priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-90 py-16">
        <div className="mx-auto max-w-7xl px-8 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Start Shopping?</h2>
          <p className="mb-8 text-xl text-gray-600">
            Browse our extensive collection of products and find exactly what
            you need
          </p>
          <Link
            href="/products"
            className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            View Products
          </Link>
        </div>
      </section>
    </main>
  );
}
