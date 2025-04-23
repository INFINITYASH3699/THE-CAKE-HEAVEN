// src/components/ui/DynamicClientComponents.js
import dynamic from 'next/dynamic';

// Fix the import paths
export const DynamicHeader = dynamic(() => import('../layout/Header'), {
  ssr: true,
});

export const DynamicNavbar = dynamic(() => import('../layout/Navbar'), {
  ssr: true,
});

export const DynamicFooter = dynamic(() => import('../layout/Footer'), {
  ssr: true,
});

// For Redux Provider
export const DynamicProviders = dynamic(() => import('../../app/providers'), {
  ssr: true,
});