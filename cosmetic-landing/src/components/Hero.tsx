'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 화장품 이미지 데이터 (Unsplash 무료 이미지)
const cosmeticImages = [
  {
    src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
    alt: '립스틱',
    size: 'w-20 h-20',
    position: 'top-[10%] left-[5%]',
    delay: '0s',
    duration: '6s',
  },
  {
    src: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop',
    alt: '스킨케어',
    size: 'w-24 h-24',
    position: 'top-[20%] right-[8%]',
    delay: '1s',
    duration: '7s',
  },
  {
    src: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop',
    alt: '세럼',
    size: 'w-16 h-16',
    position: 'bottom-[25%] left-[10%]',
    delay: '0.5s',
    duration: '5s',
  },
  {
    src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&h=200&fit=crop',
    alt: '크림',
    size: 'w-20 h-20',
    position: 'bottom-[15%] right-[5%]',
    delay: '1.5s',
    duration: '8s',
  },
  {
    src: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    alt: '파운데이션',
    size: 'w-14 h-14',
    position: 'top-[40%] left-[2%]',
    delay: '2s',
    duration: '6.5s',
  },
  {
    src: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop',
    alt: '아이섀도우',
    size: 'w-18 h-18',
    position: 'top-[5%] right-[25%]',
    delay: '0.8s',
    duration: '7.5s',
  },
  {
    src: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop',
    alt: '향수',
    size: 'w-16 h-16',
    position: 'bottom-[30%] right-[15%]',
    delay: '1.2s',
    duration: '5.5s',
  },
  {
    src: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=200&h=200&fit=crop',
    alt: '마스카라',
    size: 'w-12 h-12',
    position: 'top-[60%] right-[3%]',
    delay: '2.5s',
    duration: '6s',
  },
];

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8 bg-zinc-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-[spin_60s_linear_infinite] opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Floating Cosmetic Images */}
      {cosmeticImages.map((img, index) => (
        <div
          key={index}
          className={`absolute ${img.position} ${img.size} rounded-2xl overflow-hidden shadow-2xl shadow-black/50 opacity-0 z-20 pointer-events-none hidden lg:block`}
          style={{
            animation: `floatImage ${img.duration} ease-in-out infinite, fadeInImage 1s ease-out forwards`,
            animationDelay: `${img.delay}, ${parseFloat(img.delay) + 0.5}s`,
            transform: `translate(${mousePosition.x * (index % 2 === 0 ? 1 : -1) * 0.5}px, ${mousePosition.y * (index % 2 === 0 ? -1 : 1) * 0.5}px)`,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ))}

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[80vh] relative z-10">
        {/* Left Column */}
        <div className={`flex flex-col justify-between h-full py-8 order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <span className="text-xs tracking-[3px] uppercase text-zinc-500 font-medium animate-pulse">
            Premium OEM Service
          </span>

          <div className="my-auto lg:my-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className={`inline-block transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>당신만의</span>
              <br />
              <span className={`inline-block text-yellow-500 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>화장품 브랜드</span>
              <span className={`inline-block transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>를</span>
              <br />
              <span className={`inline-block transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>시작하세요</span>
            </h1>
            <p className={`text-base text-zinc-500 leading-relaxed max-w-xs transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              아이디어만 있으면 됩니다. 제형 개발부터 패키지 디자인, 생산까지 전문가가 함께 만들어갑니다.
            </p>

            <div className={`flex gap-4 mt-8 flex-wrap transition-all duration-700 delay-[900ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link
                href="#contact"
                className="group bg-yellow-500 text-zinc-950 px-8 py-4 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-1 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                무료 상담 신청
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="#solution"
                className="border border-zinc-700 text-white px-8 py-4 rounded-full font-medium text-sm hover:border-yellow-500 hover:text-yellow-500 hover:scale-105 transition-all duration-300"
              >
                제작 과정 알아보기
              </Link>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>

        {/* Center Column - Circle with Product Images */}
        <div className={`flex items-center justify-center relative order-1 lg:order-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          {/* Main Circle */}
          <div
            className="w-full max-w-[350px] lg:max-w-[450px] aspect-square bg-yellow-500 rounded-full flex items-center justify-center relative overflow-hidden hover:scale-105 transition-transform duration-500 cursor-pointer group"
            style={{
              transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            }}
          >
            {/* Rotating gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 animate-[spin_10s_linear_infinite]" />

            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Center content */}
            <div className="text-center text-zinc-950 p-8 relative z-10">
              <div className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tighter animate-pulse" style={{ animationDuration: '3s' }}>
                100+
              </div>
              <div className="text-lg md:text-xl lg:text-2xl font-semibold mt-2">
                최소 제작 수량
              </div>
            </div>

            {/* Inner rotating ring */}
            <div className="absolute inset-4 border-4 border-dashed border-zinc-950/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          </div>

          {/* Outer rotating ring */}
          <div className="absolute inset-[-20px] border-2 border-dashed border-yellow-500/30 rounded-full animate-[spin_20s_linear_infinite]" />

          {/* Second outer ring */}
          <div className="absolute inset-[-40px] border border-yellow-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

          {/* Orbiting cosmetic products */}
          <div className="absolute inset-[-60px] animate-[spin_12s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-yellow-500/50">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop"
                alt="립스틱"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="absolute inset-[-60px] animate-[spin_12s_linear_infinite]" style={{ animationDelay: '-4s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-xl overflow-hidden shadow-lg border-2 border-yellow-500/50">
              <Image
                src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&h=100&fit=crop"
                alt="스킨케어"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="absolute inset-[-60px] animate-[spin_12s_linear_infinite]" style={{ animationDelay: '-8s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-yellow-500/50">
              <Image
                src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&h=100&fit=crop"
                alt="세럼"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Overlay Text with animation */}
          <div className={`absolute top-[15%] left-1/2 -translate-x-1/2 text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight z-30 whitespace-nowrap mix-blend-difference hidden lg:block transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            COSMETIC
          </div>
          <div className={`absolute bottom-[15%] left-1/2 -translate-x-1/2 text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight z-30 whitespace-nowrap mix-blend-difference hidden lg:block transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            LABORATORY
          </div>

          {/* Floating particles */}
          <div className="absolute top-10 left-10 w-3 h-3 bg-yellow-500/50 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
          <div className="absolute bottom-20 right-10 w-2 h-2 bg-yellow-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
          <div className="absolute top-1/2 right-0 w-4 h-4 bg-yellow-500/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        </div>

        {/* Right Column */}
        <div className={`flex flex-col justify-between h-full py-8 text-right order-3 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <div className="hidden lg:block" />

          <div className="flex flex-col gap-6 lg:my-auto">
            {[
              { number: '500+', label: '브랜드 런칭 성공', delay: '600ms' },
              { number: '98%', label: '고객 만족도', delay: '800ms' },
              { number: '4~8주', label: '평균 제작 기간', delay: '1000ms' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-right group cursor-pointer transition-all duration-500 hover:scale-110"
              >
                <div className="text-4xl font-bold text-yellow-500 leading-none group-hover:text-yellow-400 transition-colors">{stat.number}</div>
                <div className="text-sm text-zinc-500 mt-2 group-hover:text-zinc-400 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-xs tracking-[2px] uppercase text-zinc-500 flex items-center justify-end gap-2 mt-8 lg:mt-0 animate-bounce" style={{ animationDuration: '2s' }}>
            Scroll Down
            <span className="w-10 h-px bg-zinc-500" />
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes floatImage {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(2deg);
          }
          50% {
            transform: translateY(-5px) rotate(-1deg);
          }
          75% {
            transform: translateY(-20px) rotate(1deg);
          }
        }
        @keyframes fadeInImage {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 0.9;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
