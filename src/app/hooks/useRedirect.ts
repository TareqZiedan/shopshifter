"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { startLoading } from "../redux/slices/loadingSlice";

export const useRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const redirect = (path: string) => {
    if (pathname === path) {
      return; // Don't do anything if we're already on this page
    }
    router.push(path);
    dispatch(startLoading());
  };

  return { redirect };
};
