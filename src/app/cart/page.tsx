"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import {
  removeItem,
  updateQuantity,
  clearCart,
} from "../redux/slices/cartSlice";

const Cart = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [bought, setBought] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleBuy = () => {
    setBought(true);
    dispatch(clearCart());
    setTimeout(() => setBought(false), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-white">Your Cart</h2>
        {bought && (
          <div className="mb-4 rounded bg-green-700 px-3 py-2 text-center text-white">
            Thank you for your purchase!
          </div>
        )}
        {items.length === 0 ? (
          <p className="text-gray-400">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    ${item.price} × {item.quantity}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      className="cursor-pointer rounded bg-gray-700 px-2 py-1 text-white hover:bg-gray-600"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          }),
                        )
                      }
                      disabled={item.quantity <= 1}
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button
                      className="cursor-pointer rounded bg-gray-700 px-2 py-1 text-white hover:bg-gray-600"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity + 1,
                          }),
                        )
                      }
                      title="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      className="ml-4 cursor-pointer rounded bg-red-700 px-2 py-1 text-white hover:bg-red-800"
                      onClick={() => dispatch(removeItem(item.id))}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-gray-200">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex justify-between border-t border-gray-700 pt-4 text-right font-bold text-white">
          <button
            className="w-28 cursor-pointer rounded bg-red-800 px-2 py-1 text-white transition-colors duration-500 hover:bg-black disabled:opacity-50"
            onClick={() => dispatch(clearCart())}
            disabled={items.length === 0}
          >
            Clear Cart
          </button>
          Total: ${total.toFixed(2)}
        </div>
        <div className="mt-6 flex flex-col space-y-2">
          <button
            className="w-full cursor-pointer rounded bg-[#daa520] px-4 py-2 text-white hover:bg-[#daa510] disabled:opacity-50"
            onClick={handleBuy}
            disabled={items.length === 0}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
