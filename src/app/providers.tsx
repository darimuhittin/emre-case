"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Layout from "./components/layout/Layout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Layout>{children}</Layout>
    </Provider>
  );
}
