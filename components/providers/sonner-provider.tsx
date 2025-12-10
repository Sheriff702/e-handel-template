"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      theme="system"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-border/70 bg-background/90 backdrop-blur shadow-soft",
        },
      }}
    />
  );
}
