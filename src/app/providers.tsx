"use client";

import React, { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Layout from "../components/layout/Layout";
import { initAuth, loginSuccess } from "./redux/slices/authSlice";
interface ProvidersProps {
  children: ReactNode;
}



export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    store.dispatch(initAuth());
  }, []);

  return (
    <Provider store={store}>
      <Layout>{children}</Layout>
    </Provider>
  );
}
