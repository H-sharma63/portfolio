'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard'); // Redirect to a dashboard page after successful login
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-[#3a3a3a] text-white text-2xl">Loading...</div>; // Or a more sophisticated loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3a3a3a] text-white">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-md w-full max-w-md text-center border border-[#CFCFCF]">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Login Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <button
          onClick={() => signIn('google')}
          className="bg-[#CFCFCF] text-[#3a3a3a] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

const AdminPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AdminLoginPage />
  </Suspense>
);

export default AdminPageWithSuspense;