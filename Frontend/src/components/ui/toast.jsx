// components/ui/toast.jsx
import * as React from "react";

export function ToastProvider({ children }) {
  return <>{children}</>;
}

export function ToastViewport({ children }) {
  return (
    <div className="fixed bottom-4 right-4 w-80 space-y-2 z-50">
      {children}
    </div>
  );
}
