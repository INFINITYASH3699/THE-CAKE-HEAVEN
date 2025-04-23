'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { getUserProfile } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If we're not sure of authentication status, try to get the user profile
    if (!isAuthenticated && !isLoading) {
      dispatch(getUserProfile())
        .unwrap()
        .catch(() => {
          router.push('/login');
        });
    }
  }, [dispatch, isAuthenticated, isLoading, router]);

  useEffect(() => {
    // If user is authenticated but route requires admin and user is not admin
    if (isAuthenticated && requireAdmin && user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, requireAdmin, user, router]);

  // Show nothing while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Check if admin is required but user is not admin
  if (requireAdmin && user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;