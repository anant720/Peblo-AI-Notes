"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1d1a23',
          color: '#e7e0ed',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }} />
    </SessionProvider>
  );
}
