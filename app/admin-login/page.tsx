'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/auth/signin?callbackUrl=/admin');
  }, [router]);

  return (
    <div className="container-max py-12">
      <p className="text-center text-gray-600">Redirecting to sign in…</p>
    </div>
  );
}
