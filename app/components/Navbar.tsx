'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Featured', href: '/featured' },
  { label: 'Shop', href: '/shop' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'About', href: '/about' },
  { label: 'Admin', href: '/admin-login' },
];

export function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide navbar when scrolling down
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header 
      className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/5"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <nav className="mx-auto flex h-20 md:h-24 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo Left */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] text-black">
              BOOKSTORE
            </span>
            <span className="text-xs tracking-[0.15em] md:tracking-[0.2em] text-black/60 mt-0.5 md:mt-1">
              DISCOVER STORIES
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex relative items-center gap-8 lg:gap-12 text-xs font-semibold tracking-[0.15em] uppercase text-black">
          {navItems.map((item) => {
            const isCurrent = hovered === item.label;

            return (
              <div
                key={item.href}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
                className="relative pb-1"
              >
                <Link href={item.href} className="relative z-10 block">
                  {item.label}
                </Link>

                {/* Animated underline */}
                <motion.div
                  className="pointer-events-none absolute left-0 right-0 bottom-0 h-0.5 bg-black"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={
                    isCurrent
                      ? { scaleX: 1 }
                      : { scaleX: 0 }
                  }
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden bg-white border-t border-black/5"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="flex flex-col gap-0 px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 px-2 text-sm font-semibold tracking-[0.1em] uppercase text-black hover:text-[#c4a177] transition-colors border-b border-black/5 last:border-b-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
}
