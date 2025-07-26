'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminSettingsPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading settings...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#3a3a3a] text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-gray-300">This is where you will configure admin panel settings.</p>
        {/* Settings forms will go here */}
      </div>
    );
  }

  return null;
}
