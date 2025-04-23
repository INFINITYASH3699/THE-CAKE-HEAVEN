// components/auth/AuthInit.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';

export default function AuthInit() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check auth status when component mounts
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}