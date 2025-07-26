'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin'); // Redirect to login if not authenticated
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading dashboard...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#3a3a3a] text-[#CACACA] p-8 text-center">
        <h1 className="text-4xl font-black mb-6">Admin Dashboard</h1>
        <div className="flex justify-between items-center mb-4">
          <p>Welcome, {session.user?.name} ({session.user?.email})!</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign out
          </button>
        </div>
        {/* Add your dashboard content here */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#CACACA]">Content Management</h2>
              <p className="text-[#CACACA] mb-4">Manage your portfolio sections, text, and images.</p>
            </div>
            <div className="flex justify-center">
              <a href="/admin/content" className="bg-[#CACACA] hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline">Go to Content</a>
            </div>
          </div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#CACACA]">3D Model Management</h2>
              <p className="text-[#CACACA] mb-4">Upload and manage your 3D models.</p>
            </div>
            <div className="flex justify-center">
              <a href="/admin/model" className="bg-[#CACACA] hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline">Go to 3D Models</a>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  return null; // Should not reach here if status is loading or authenticated/unauthenticated
}
