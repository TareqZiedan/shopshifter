"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Cart = () => {
  const items = useSelector((state: RootState) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="w-full max-w-md rounded-lg border p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.price} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 border-t pt-4 text-right font-bold">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
};

export default Cart;
