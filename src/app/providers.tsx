"use client";

// 1. React and hooks
import React, { ReactNode, useEffect } from "react";

// 2. Next.js imports
import { useRouter } from "next/navigation";

// 3. Redux
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { initAuth } from "@/redux/slices/authSlice";

// 4. Components
import Layout from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";

// 5. Services
import { registerRouter } from "@/services/navigationHelper";
import { registerDispatch } from "@/services/dispatchHelper";

// 6. Types
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // 1. Hooks
  const router = useRouter();

  // 2. Effects
  useEffect(() => {
    store.dispatch(initAuth());
  }, []);

  useEffect(() => {
    registerRouter(router);
  }, [router]);

  // 3. Component JSX
  return (
    <Provider store={store}>
      <Layout>{children}</Layout>
      <Toaster expand={true} richColors />
    </Provider>
  );
}
