"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { startLoading } from "../redux/slices/loadingSlice";

export const useRedirect = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const redirect = (path: string) => {
    dispatch(startLoading());
    router.push(path);
  };

  return { redirect };
};
