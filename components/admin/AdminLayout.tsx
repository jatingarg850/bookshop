'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { FaChartBar, FaTags, FaBox, FaClipboardList, FaTruck, FaFileInvoice, FaStar, FaUsers, FaComments, FaCog, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: FaChartBar },
    { href: '/admin/categories', label: 'Categories', icon: FaTags },
    { href: '/admin/products', label: 'Products', icon: FaBox },
    { href: '/admin/orders', label: 'Orders', icon: FaClipboardList },
    { href: '/admin/delivery', label: 'Delivery', icon: FaTruck },
    { href: '/admin/invoices', label: 'Invoices', icon: FaFileInvoice },
    { href: '/admin/reviews', label: 'Reviews', icon: FaStar },
    { href: '/admin/users', label: 'Users', icon: FaUsers },
    { href: '/admin/contact', label: 'Contact Messages', icon: FaComments },
    { href: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="font-heading text-2xl font-bold">Radhe Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Management Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const IconComponent = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full text-gray-300 border-gray-600 hover:bg-gray-800 flex items-center justify-center gap-2">
              <FaArrowLeft className="w-4 h-4" />
              Back to Store
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-400 border-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
            onClick={() => signOut()}
          >
            <FaSignOutAlt className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
