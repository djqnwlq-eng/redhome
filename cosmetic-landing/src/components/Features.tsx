'use client';

import { useEffect, useRef, useState } from 'react';

const features = [
  { number: '01', title: '스킨케어', description: '토너, 세럼, 에센스, 크림, 앰플 등 다양한 스킨케어 제품' },
  { number: '02', title: '메이크업', description: '립스틱, 틴트, 파운데이션, 쿠션 등 색조 화장품' },
  { number: '03', title: '클렌징', description: '클렌징 오일, 폼, 워터, 밀크 등 세안 제품' },
  { number: '04', title: '선케어', description: '선크림, 선스틱, 선쿠션 등 자외선 차단 제품' },
  { number: '05', title: '바디케어', description: '바디로션, 바디워시, 핸드크림, 바디미스트' },
  { number: '06', title: '헤어케어', description: '샴푸, 트리트먼트, 헤어에센스, 헤어미스트' },
];

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 px-8 bg-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-red-500 text-sm font-semibold tracking-[2px] uppercase mb-4 animate-pulse">
            SERVICES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">맞춤 제조 서비스</h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            스킨케어부터 메이크업까지, 모든 카테고리를 지원합니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className={`bg-zinc-800 rounded-2xl p-10 border border-zinc-700 text-center hover:-translate-y-4 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 group cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center text-2xl font-bold text-red-500 mx-auto mb-6 group-hover:bg-red-500 group-hover:text-zinc-950 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {feature.number}
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-red-500 transition-colors">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
