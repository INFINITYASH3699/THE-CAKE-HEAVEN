'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/redux/store';
import { getUserProfile } from '@/redux/slices/userSlice';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import Navbar from '@/components/layout/Navbar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(getUserProfile())
        .unwrap()
        .catch(() => {
          router.push('/login?redirect=/profile');
        });
    }
  }, [dispatch, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // This will show nothing while redirecting
  }

  // Redirect admins to admin panel
  if (user.role === 'admin') {
    router.push('/admin/dashboard');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProfileSidebar />
        </div>
        <div className="md:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}