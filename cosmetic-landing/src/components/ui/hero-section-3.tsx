'use client';

import React, { useState, useEffect, useMemo } from "react";
import { Search, MessageCircle } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

interface HeroSectionProps {
  backgroundImage: string;
  logoText?: string;
  brandName?: string;
  navLinks?: NavLink[];
  versionText?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  typingEnabled?: boolean;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

// 타이핑 애니메이션 훅
function useTypingEffect(text: string, speed: number = 50, delay: number = 0, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    setHasStarted(false);

    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay, enabled]);

  useEffect(() => {
    if (!hasStarted || !enabled) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [hasStarted, text, speed, enabled]);

  return { displayedText, isComplete };
}

export default function HeroSection({
  backgroundImage,
  logoText = "R.",
  brandName = "REDMEDICOS",
  navLinks = [],
  versionText = "",
  title = "",
  subtitle = "",
  ctaText = "Click",
  typingEnabled = true,
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setIsLoaded(true);

    // 클라이언트에서만 파티클 생성 (hydration 에러 방지)
    const generatedParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  // 타이핑 효과
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect(
    title,
    80,
    500,
    typingEnabled
  );
  const { displayedText: typedSubtitle, isComplete: subtitleComplete } = useTypingEffect(
    subtitle,
    30,
    title.length * 80 + 800,
    typingEnabled
  );

  return (
    <>
      <header className={`absolute inset-x-0 top-0 p-6 md:p-8 z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="container mx-auto flex justify-between items-center">
          {/* 로고 + 브랜드명 */}
          <div className="flex items-center gap-2">
            <div className="text-4xl font-black text-red-600 tracking-tight">{logoText}</div>
            <span className="text-xl font-bold text-white tracking-wider hidden sm:block">{brandName}</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-red-500 transition-colors duration-300"
                style={{
                  animation: isLoaded ? `fadeInDown 0.5s ease forwards ${index * 0.1}s` : 'none',
                  opacity: 0,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button type="button" aria-label="Search" className="hover:text-red-500 transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <button className="border border-white rounded-full px-6 py-2 text-sm font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300">
              상담신청
            </button>
          </div>
        </div>
      </header>

      <main
        className="w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* 오버레이 - 레드 틴트 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-red-950/30" />

        {/* 미래지향적 그리드 오버레이 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* 글로우 라인 효과 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* 글로우 서클 효과 */}
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-2xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        {/* 애니메이션 파티클 - 레드 컬러 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-red-500/60 rounded-full shadow-sm shadow-red-500"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* 스캔라인 효과 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }} />

        <div className="container mx-auto h-screen flex items-center px-6 md:px-8 relative z-10">
          <div className="w-full md:w-1/2 lg:w-3/5">
            {/* 타이핑 타이틀 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="inline-block">
                {typedTitle}
                {!titleComplete && typingEnabled && (
                  <span className="inline-block w-1 h-12 md:h-16 bg-red-600 ml-1 animate-blink" />
                )}
              </span>
            </h1>

            {/* 타이핑 서브타이틀 */}
            <div className="min-h-[80px]">
              <p className="text-lg md:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed">
                {typedSubtitle}
                {titleComplete && !subtitleComplete && typingEnabled && (
                  <span className="inline-block w-0.5 h-5 bg-red-600 ml-1 animate-blink" />
                )}
              </p>
            </div>

            {/* CTA 버튼 - 레드 */}
            <div className={`transition-all duration-700 ${subtitleComplete || !typingEnabled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-red-600 text-white font-bold px-10 py-4 rounded-full hover:bg-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-600/40 transition-all duration-300"
              >
                {ctaText}
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>

            {/* 통계 - 레드 */}
            <div className={`flex gap-12 mt-16 transition-all duration-700 delay-300 ${subtitleComplete || !typingEnabled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { number: '500+', label: '브랜드 런칭' },
                { number: '98%', label: '만족도' },
                { number: '100+', label: '최소 수량' },
              ].map((stat) => (
                <div key={stat.label} className="group cursor-pointer">
                  <div className="text-3xl md:text-4xl font-bold text-red-500 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className={`absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-400">{versionText}</div>
          <button
            type="button"
            aria-label="Chat"
            className="bg-red-600/20 backdrop-blur-sm rounded-full h-14 w-14 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 group"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </footer>

      {/* 커스텀 애니메이션 CSS */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}
