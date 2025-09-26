"use client";

import type React from "react";

import { Provider } from "react-redux";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { store } from "@/lib/store/store";
import AppLayout from "./AppLayout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <AppLayout>{children}</AppLayout>
      </LanguageProvider>
    </Provider>
  );
}
