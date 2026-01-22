'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  { number: 1, title: '무료 상담', description: '원하시는 제품 컨셉과 예산을 말씀해주세요' },
  { number: 2, title: '제형 개발', description: '전문 연구원이 맞춤 제형을 개발합니다' },
  { number: 3, title: '샘플 테스트', description: '샘플을 직접 확인하고 피드백 반영' },
  { number: 4, title: '생산 & 납품', description: '대량 생산 및 안전한 포장 배송' },
];

const benefits = [
  { title: '최소 100개부터 생산', description: '작은 수량으로 시작해 점점 키워가세요' },
  { title: '1:1 전담 매니저 배정', description: '제형부터 패키지까지 모든 과정을 함께합니다' },
  { title: '인허가 대행 서비스', description: '복잡한 화장품 인증 절차를 대행해드립니다' },
];

export default function Solution() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="solution" className="py-24 px-8 bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
            <p className="text-red-500 text-sm font-semibold tracking-[2px] uppercase mb-4 animate-pulse">
              OUR SOLUTION
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              소량이어도 <span className="text-red-500">프리미엄</span>으로,
              <br />
              합리적인 가격에
            </h2>
            <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
              REDMEDICOS는 소량 생산에 특화된 화장품 제조 전문 기업입니다. 100개부터 시작할 수 있어 리스크를 최소화하고, 시장 반응을 먼저 확인할 수 있습니다.
            </p>

            <ul className="space-y-6">
              {benefits.map((benefit, index) => (
                <li
                  key={benefit.title}
                  className={`flex items-start gap-4 group cursor-pointer transition-all duration-500 hover:translate-x-2 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                >
                  <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white font-semibold group-hover:text-red-500 transition-colors">{benefit.title}</strong>
                    <p className="text-zinc-500 text-sm mt-1 group-hover:text-zinc-400 transition-colors">{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Process Steps */}
          <div className={`bg-zinc-800 rounded-3xl p-8 lg:p-12 border border-zinc-700 hover:border-red-500/50 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
          }`}>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-6 group cursor-pointer transition-all duration-500 hover:translate-x-2 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${400 + index * 150}ms` }}
                >
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold group-hover:text-red-500 transition-colors">{step.title}</h4>
                    <p className="text-zinc-500 text-sm group-hover:text-zinc-400 transition-colors">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
