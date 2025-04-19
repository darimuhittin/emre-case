"use client";

import React, { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Layout from "../components/layout/Layout";
import { initAuth } from "./redux/slices/authSlice";
import { registerRouter } from "./services/navigationService";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();
  useEffect(() => {
    store.dispatch(initAuth());
  }, []);

  useEffect(() => {
    registerRouter(router);
  }, [router]);
  return (
    <Provider store={store}>
      <Layout>{children}</Layout>
      <Toaster expand={true} richColors />
    </Provider>
  );
}
