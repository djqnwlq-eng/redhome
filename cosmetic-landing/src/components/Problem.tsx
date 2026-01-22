'use client';

import { useEffect, useRef, useState } from 'react';

const problems = [
  {
    number: '01',
    title: '"최소 주문량이 너무 많아요"',
    description: '대형 OEM 공장은 최소 5,000개 이상 요구합니다. 처음 시작하는 브랜드에게는 부담스러운 수량이죠.',
  },
  {
    number: '02',
    title: '"제형 개발, 어디서부터 해야 할지"',
    description: '원하는 컨셉은 있는데 어떤 성분을 써야 하는지, 어떻게 제형을 만들어야 하는지 모르겠어요.',
  },
  {
    number: '03',
    title: '"초기 비용이 너무 많이 들어요"',
    description: '패키지, 제형 개발, 인증까지... 예상보다 훨씬 많은 비용에 시작도 전에 포기하게 됩니다.',
  },
];

export default function Problem() {
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
    <section ref={sectionRef} id="problem" className="py-24 px-8 bg-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-red-500 text-sm font-semibold tracking-[2px] uppercase mb-4 animate-pulse">
            WHY US
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">이런 고민 하고 계시죠?</h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            화장품 브랜드를 시작하고 싶지만 막막하셨던 분들을 위해
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={problem.number}
              className={`bg-zinc-800 rounded-2xl p-8 border border-zinc-700 hover:-translate-y-4 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 group cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-xl font-bold text-red-500 mb-6 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {problem.number}
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-red-500 transition-colors">{problem.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
