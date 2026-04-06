'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect dashboard root to products list
    router.replace('/admin/products');
  }, [router]);

  return <div className="text-gray-500">Redirecting to Products...</div>;
}
