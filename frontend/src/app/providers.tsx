// src/app/providers.tsx
"use client";

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from '@/components/ui/ToastProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>
        {children}
        <Toaster position="top-right" />
      </ToastProvider>
    </Provider>
  );
}
