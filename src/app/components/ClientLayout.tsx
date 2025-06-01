"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { stopLoading } from "../redux/slices/loadingSlice";
import { loadUser } from "../redux/slices/authSlice";
import { GlobalLoadingModal } from "./GlobalLoadingModal";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useRouter } from "next/navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(stopLoading());

    // Prefetch important pages
    const prefetchPages = async () => {
      try {
        console.log("Starting to prefetch important pages...");

        // Prefetch products page
        await router.prefetch("/products");
        console.log("Successfully prefetched products page");

        // Prefetch cart page
        await router.prefetch("/cart");
        console.log("Successfully prefetched cart page");

        // Prefetch first few product detail pages
        for (let i = 1; i <= 4; i++) {
          await router.prefetch(`/products/${i}`);
          console.log(`Successfully prefetched product ${i} page`);
        }

        console.log("All important pages prefetched successfully");
      } catch (error) {
        console.error("Error prefetching pages:", error);
      }
    };

    prefetchPages();
  }, [dispatch, router]);

  return (
    <>
      <GlobalLoadingModal />
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
