'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 px-8 py-4 z-50 border-b border-zinc-800 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/98' : 'bg-zinc-950/95'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-yellow-500">
          CosmeticLab
        </Link>

        <ul className="hidden md:flex gap-8">
          <li>
            <Link href="#problem" className="text-zinc-400 text-sm hover:text-yellow-500 transition-colors">
              고민
            </Link>
          </li>
          <li>
            <Link href="#solution" className="text-zinc-400 text-sm hover:text-yellow-500 transition-colors">
              솔루션
            </Link>
          </li>
          <li>
            <Link href="#features" className="text-zinc-400 text-sm hover:text-yellow-500 transition-colors">
              서비스
            </Link>
          </li>
          <li>
            <Link href="#faq" className="text-zinc-400 text-sm hover:text-yellow-500 transition-colors">
              FAQ
            </Link>
          </li>
        </ul>

        <Link
          href="#contact"
          className="bg-yellow-500 text-zinc-950 px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-0.5 transition-all"
        >
          무료 상담 신청
        </Link>
      </div>
    </nav>
  );
}
