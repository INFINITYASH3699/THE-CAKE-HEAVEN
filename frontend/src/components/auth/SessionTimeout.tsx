// components/auth/SessionTimeout.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from '@/redux/store';

// Set timeout to 60 minutes (adjust as needed)
const SESSION_TIMEOUT = 60 * 60 * 1000;

export default function SessionTimeout() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      // Set timeout to log user out
      timeoutId = setTimeout(() => {
        dispatch(logout());
        alert('Your session has expired due to inactivity. Please log in again.');
      }, SESSION_TIMEOUT);
    };
    
    // Set initial timeout
    resetTimeout();
    
    // Reset timeout on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetTimeout();
    };
    
    // Add event listeners for user activity
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [dispatch, isAuthenticated]);
  
  // This component doesn't render anything
  return null;
}