"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../redux/slices/loadingSlice";

export const usePageLoad = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading());
    const timer = setTimeout(() => {
      dispatch(stopLoading());
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);
};
