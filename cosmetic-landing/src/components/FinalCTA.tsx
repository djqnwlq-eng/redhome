'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function FinalCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-8 bg-zinc-950 text-center overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className={`inline-block bg-red-500/10 border border-red-500 px-6 py-3 rounded-xl mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'} hover:scale-105 cursor-pointer animate-bounce`} style={{ animationDuration: '3s' }}>
          <span className="text-red-500 font-semibold">
            이번 달 상담 신청 시 샘플 제작비 50% 할인
          </span>
        </div>

        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          지금 바로
          <br />
          <span className="text-red-500">당신의 브랜드</span>를 시작하세요
        </h2>

        <p className={`text-zinc-500 text-lg mb-8 leading-relaxed transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          아이디어만 있으면 됩니다. 나머지는 저희가 함께 만들어갑니다.
          <br />
          24시간 내 전문 상담사가 연락드립니다.
        </p>

        <Link
          href="#contact"
          className={`inline-flex items-center gap-2 bg-red-500 text-white px-10 py-5 rounded-full font-semibold text-lg hover:-translate-y-2 hover:scale-110 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '600ms' }}
        >
          무료 상담 신청하기
          <span className="group-hover:translate-x-2 transition-transform">→</span>
        </Link>
      </div>
    </section>
  );
}
