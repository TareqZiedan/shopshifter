"use client";

import { useSelector, useDispatch } from "react-redux";
import type { CartItem } from "../redux/slices/authSlice";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../redux/slices/authSlice";
import type { RootState } from "../redux/store";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { stopLoading } from "../redux/slices/loadingSlice";
import { useTheme } from "../context/ThemeContext";

export default function Cart() {
  const cartItems = useSelector((state: RootState) => state.auth.cart);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  useEffect(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  const handleCheckout = () => {
    dispatch(clearCart());
    setIsCheckoutComplete(true);
  };

  const total = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );

  if (isCheckoutComplete) {
    return (
      <main className="bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-card-background rounded-lg p-8 text-center shadow-sm">
            <div className="text-primary-600 dark:text-primary-400 mb-4 text-4xl">
              ✅
            </div>
            <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
              Order Placed Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been received and is
              being processed.
            </p>
            <Link
              href="/products"
              className={`inline-block cursor-pointer rounded-md px-6 py-2 text-sm font-medium text-white transition-colors ${
                theme === "dark"
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-foreground mb-8 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
            Your Cart
          </h1>
          <div className="bg-card-background rounded-lg p-8 text-center shadow-sm">
            <p className="text-muted-foreground mb-4 text-lg">
              Your cart is empty
            </p>
            <Link
              href="/products"
              className="bg-primary-600 text-primary-foreground hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 inline-block cursor-pointer rounded-md px-6 py-2 text-sm font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-foreground mb-8 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          Your Cart
        </h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="bg-card-background flex items-center gap-4 rounded-lg p-4 shadow-sm"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-card-foreground text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: Math.max(0, item.quantity - 1),
                            }),
                          )
                        }
                        className="bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer rounded-md px-2 py-1"
                      >
                        -
                      </button>
                      <span className="text-card-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                        className="bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer rounded-md px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="cursor-pointer rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card-background rounded-lg p-6 shadow-sm">
              <h2 className="text-card-foreground mb-4 text-xl font-semibold">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="text-muted-foreground flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-border my-4 border-t" />
                <div className="text-card-foreground flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className={`mt-6 w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
