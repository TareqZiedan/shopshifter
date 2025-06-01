"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { stopLoading } from "./redux/slices/loadingSlice";
import { useEffect } from "react";
import { useTheme } from "./context/ThemeContext";

export default function Home() {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="from-primary-50 to-background dark:from-primary-900/20 dark:to-background relative bg-gradient-to-b py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to{" "}
              <span className="text-primary-600 dark:text-primary-400">
                ShopShifter
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Your one-stop destination for all your shopping needs. Discover
              quality products at competitive prices.
            </p>
            <Link
              href="/products"
              className={`inline-block rounded-full px-8 py-3 font-semibold text-white transition-colors ${
                theme === "dark"
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-8">
          <h2 className="text-foreground mb-12 text-center text-3xl font-bold">
            Why Choose Us
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-card-background rounded-lg p-6 text-center shadow-sm">
              <div className="text-primary-600 dark:text-primary-400 mb-4 text-4xl">
                🚚
              </div>
              <h3 className="text-card-foreground mb-2 text-xl font-semibold">
                Fast Delivery
              </h3>
              <p className="text-muted-foreground">
                Get your products delivered quickly and reliably
              </p>
            </div>
            <div className="bg-card-background rounded-lg p-6 text-center shadow-sm">
              <div className="text-primary-600 dark:text-primary-400 mb-4 text-4xl">
                💎
              </div>
              <h3 className="text-card-foreground mb-2 text-xl font-semibold">
                Quality Products
              </h3>
              <p className="text-muted-foreground">
                Carefully selected items that meet our high standards
              </p>
            </div>
            <div className="bg-card-background rounded-lg p-6 text-center shadow-sm">
              <div className="text-primary-600 dark:text-primary-400 mb-4 text-4xl">
                🛡️
              </div>
              <h3 className="text-card-foreground mb-2 text-xl font-semibold">
                Secure Shopping
              </h3>
              <p className="text-muted-foreground">
                Your security is our top priority
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-accent dark:bg-accent/50 py-16">
        <div className="mx-auto max-w-7xl px-8 text-center">
          <h2 className="text-foreground mb-6 text-3xl font-bold">
            Ready to Start Shopping?
          </h2>
          <p className="text-muted-foreground mb-8 text-xl">
            Browse our extensive collection of products and find exactly what
            you need
          </p>
          <Link
            href="/products"
            className={`inline-block rounded-full px-8 py-3 font-semibold text-white transition-colors ${
              theme === "dark"
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            View Products
          </Link>
        </div>
      </section>
    </main>
  );
}
