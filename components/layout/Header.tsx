'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/Button';
import { UserDropdown } from './UserDropdown';
import { useState, useEffect } from 'react';

export function Header() {
  const { data: session } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50" suppressHydrationWarning>
      {/* Top bar with contact info */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span>📞 +91 98217 38866</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <span>✉️ sre.haryana24@gmail.com</span>
              </div>
            </div>
            <div className="hidden sm:block">
              
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo.jpg" alt="Radhe Stationery Logo" className="h-16 w-auto" />
            <span className="font-heading text-xl font-bold text-primary-700">
              Radhe Stationery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Cart and Auth */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative" suppressHydrationWarning>
              <img src="/cart.png" alt="Cart" className="w-6 h-6" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {session?.user ? (
              <UserDropdown />
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">Sign In</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
