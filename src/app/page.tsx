"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { stopLoading } from "./redux/slices/loadingSlice";
import Products from "./components/Products";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-center text-2xl font-bold">Welcome to ShopShifter</h1>
      <Products />
    </main>
  );
}
