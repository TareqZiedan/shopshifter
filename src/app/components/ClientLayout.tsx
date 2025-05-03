"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { startLoading } from "../redux/slices/loadingSlice";
import { GlobalLoadingModal } from "./GlobalLoadingModal";
import Navigation from "./Navigation";
import Footer from "./Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading());
  }, [dispatch]);

  return (
    <>
      <GlobalLoadingModal />
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
