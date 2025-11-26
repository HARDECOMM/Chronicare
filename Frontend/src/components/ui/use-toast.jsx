// components/ui/use-toast.js
import * as React from "react";
import { ToastProvider, ToastViewport } from "./toast";

const ToastContext = React.createContext();

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProviderWrapper({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const toast = (props) => {
    setToasts((prev) => [...prev, { id: Date.now(), ...props }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {children}
        <ToastViewport>
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`bg-white border rounded p-4 shadow mb-2 ${
                t.variant === "destructive"
                  ? "border-red-500 text-red-600"
                  : t.variant === "success"
                  ? "border-green-500 text-green-600"
                  : "border-purple-500 text-purple-600"
              }`}
            >
              <strong>{t.title}</strong>
              {t.description && <p>{t.description}</p>}
              <button
                className="ml-2 text-sm text-gray-500"
                onClick={() => removeToast(t.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </ToastViewport>
      </ToastProvider>
    </ToastContext.Provider>
  );
}
