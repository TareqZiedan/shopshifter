"use client";

import React, { useState } from "react";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([
    // Example item (remove this in production)
    { id: 1, title: "Example Product", price: 19.99, quantity: 2 },
  ]);

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
                <p className="font-medium">{item.title}</p>
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
