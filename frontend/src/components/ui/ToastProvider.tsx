"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { NotificationContainer } from "./Notification";

// Define the Toast type
export type ToastType = "success" | "error" | "info" | "warning";

// Define the Toast interface
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

// Define context type
type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

// Toast action types
type ToastAction =
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: { id: string } }
  | { type: "CLEAR_TOASTS" };

// Create the context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Reducer function to manage toast state
function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "ADD_TOAST":
      return [...state, action.payload];
    case "REMOVE_TOAST":
      return state.filter((toast) => toast.id !== action.payload.id);
    case "CLEAR_TOASTS":
      return [];
    default:
      return state;
  }
}

// Create the provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  // Add a new toast
  const addToast = (toast: Omit<Toast, "id">) => {
    const id = uuidv4();
    dispatch({
      type: "ADD_TOAST",
      payload: { id, ...toast },
    });
  };

  // Remove a toast by ID
  const removeToast = (id: string) => {
    dispatch({
      type: "REMOVE_TOAST",
      payload: { id },
    });
  };

  // Clear all toasts
  const clearToasts = () => {
    dispatch({ type: "CLEAR_TOASTS" });
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <NotificationContainer
        notifications={toasts}
        onClose={removeToast}
        position="top-right"
      />
    </ToastContext.Provider>
  );
}

// Custom hook to use toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Convenience methods for different toast types
export function useToastMessages() {
  const { addToast } = useToast();

  return {
    success: (message: string, description?: string) => {
      addToast({ type: "success", message, description });
    },
    error: (message: string, description?: string) => {
      addToast({ type: "error", message, description });
    },
    warning: (message: string, description?: string) => {
      addToast({ type: "warning", message, description });
    },
    info: (message: string, description?: string) => {
      addToast({ type: "info", message, description });
    },
  };
}
