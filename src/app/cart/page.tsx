"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { stopLoading } from "../redux/slices/loadingSlice";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice";

const Cart = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleBuy = () => {
    // TODO: Implement buy functionality
    console.log("Buying items:", items);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-white">Shopping Cart</h1>
        {items.length === 0 ? (
          <p className="text-gray-400">Your cart is empty.</p>
        ) : (
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-6 rounded-lg border border-gray-700 p-4"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-white">
                    {item.title}
                  </h3>
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
                      onClick={() => dispatch(removeFromCart(item.id))}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-6">
          <button
            className="cursor-pointer rounded bg-red-800 px-4 py-2 text-white transition-colors duration-500 hover:bg-black disabled:opacity-50"
            onClick={() => dispatch(clearCart())}
            disabled={items.length === 0}
            title="Remove all items from cart"
          >
            Clear Cart
          </button>
          <div className="text-right">
            <p className="text-lg font-semibold text-white">
              Total: ${total.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <button
            className="w-full cursor-pointer rounded bg-[#daa520] px-4 py-2 text-white hover:bg-[#daa510] disabled:opacity-50"
            onClick={handleBuy}
            disabled={items.length === 0}
            title="Proceed to checkout"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
