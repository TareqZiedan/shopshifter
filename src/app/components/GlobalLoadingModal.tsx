"use client";

import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import LoadingModal from "./LoadingModal";

export const GlobalLoadingModal = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  return isLoading ? <LoadingModal /> : null;
};
