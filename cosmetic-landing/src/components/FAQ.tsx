'use client';

import { useState, useEffect, useRef } from 'react';

const faqs = [
  {
    question: '최소 주문 수량이 어떻게 되나요?',
    answer: '제품 종류에 따라 다르지만, 기본적으로 100개부터 제작이 가능합니다. 초기 브랜드 런칭 시 재고 부담 없이 시작하실 수 있습니다.',
  },
  {
    question: '제작 기간은 얼마나 걸리나요?',
    answer: '제형 개발부터 생산까지 보통 4-8주 정도 소요됩니다. 기존 제형 사용 시 더 빠르게 진행 가능하며, 상담 시 정확한 일정을 안내해드립니다.',
  },
  {
    question: '샘플 제작도 가능한가요?',
    answer: '네, 가능합니다. 본 생산 전 샘플을 제작하여 텍스처, 향, 색상 등을 직접 확인하실 수 있습니다. 샘플 비용은 본 계약 시 전액 차감됩니다.',
  },
  {
    question: '화장품 인허가는 어떻게 하나요?',
    answer: '화장품 인허가 대행 서비스를 제공합니다. 화장품책임판매업 등록, 제품 신고 등 모든 법적 절차를 대행해드리니 걱정하지 않으셔도 됩니다.',
  },
  {
    question: '패키지 디자인도 해주시나요?',
    answer: '네, 용기 선정부터 라벨 디자인, 박스 패키지까지 원스톱으로 진행 가능합니다. 기존 디자인이 있으시면 그대로 적용도 가능합니다.',
  },
  {
    question: '비용은 어느 정도 예상하면 될까요?',
    answer: '제품 종류, 수량, 패키지에 따라 달라집니다. 무료 상담을 신청해주시면 원하시는 제품에 맞는 맞춤 견적을 안내해드립니다.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} id="faq" className="py-24 px-8 bg-zinc-900 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-red-500 text-sm font-semibold tracking-[2px] uppercase mb-4 animate-pulse">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">자주 묻는 질문</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-zinc-800 rounded-2xl border border-zinc-700 overflow-hidden hover:border-red-500/50 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              } ${activeIndex === index ? 'shadow-lg shadow-red-500/10' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:text-red-500 transition-colors group"
              >
                <span className="font-medium text-lg group-hover:translate-x-2 transition-transform">{faq.question}</span>
                <span
                  className={`text-2xl text-red-500 transition-all duration-300 ${
                    activeIndex === index ? 'rotate-45 scale-125' : 'group-hover:scale-110'
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  activeIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-5 text-zinc-500 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
