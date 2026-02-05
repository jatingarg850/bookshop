'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="container-max py-12">
      <p className="text-center text-gray-600">Redirecting to the admin panel…</p>
    </div>
  );
}
