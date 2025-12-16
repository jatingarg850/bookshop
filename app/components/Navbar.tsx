'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Home', href: '#' },
  { label: 'Featured', href: '#featured' },
  { label: 'Shop', href: '#shop' },
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
        {/* Logo Left */}
        <Link href="/" className="flex items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-[0.3em] text-black">
              BOOKSTORE
            </span>
            <span className="text-xs tracking-[0.2em] text-black/60 mt-1">
              DISCOVER STORIES
            </span>
          </div>
        </Link>

        {/* Links Right */}
        <div className="relative flex items-center gap-12 text-xs font-semibold tracking-[0.15em] uppercase text-black">
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
      </nav>
    </motion.header>
  );
}
