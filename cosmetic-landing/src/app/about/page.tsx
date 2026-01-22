'use client';

import Link from 'next/link';
import { ArrowLeft, Target, Eye, Users, Award, Calendar, Building2 } from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    { year: '2015', event: '레드메디코스 설립' },
    { year: '2017', event: '화장품 제조업 허가 취득' },
    { year: '2019', event: '100+ 브랜드 런칭 달성' },
    { year: '2021', event: 'ISO 22716 인증 획득' },
    { year: '2023', event: '300+ 브랜드 파트너십 달성' },
    { year: '2024', event: '500+ 브랜드 런칭 달성' },
  ];

  const values = [
    {
      icon: Target,
      title: '정확성',
      description: '고객의 요구사항을 정확히 파악하고 최적의 제형을 제안합니다.',
    },
    {
      icon: Award,
      title: '품질',
      description: '엄격한 품질 관리 시스템으로 안전하고 효과적인 제품을 생산합니다.',
    },
    {
      icon: Users,
      title: '파트너십',
      description: '단순 제조를 넘어 브랜드 성공을 위한 진정한 파트너가 됩니다.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* 헤더 */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-black text-red-600">R.</span>
              <span className="text-lg font-bold text-white">REDMEDICOS</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">홈으로</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              당신의 브랜드를 함께 만들어가는<br />
              <span className="text-red-500">신뢰할 수 있는 파트너</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              REDMEDICOS는 화장품 소량제조 전문 기업으로, 아이디어만 있으면 누구나
              자신만의 화장품 브랜드를 시작할 수 있도록 제형 개발부터 패키지 디자인,
              인허가, 생산까지 원스톱 서비스를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 미션 & 비전 */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Mission</h2>
              <p className="text-zinc-400 leading-relaxed">
                화장품 제조의 높은 진입장벽을 낮추어, 누구나 자신만의 브랜드를
                시작할 수 있는 환경을 만듭니다. 최소 100개부터 시작 가능한
                소량제조 시스템으로 창업자들의 꿈을 현실로 만들어갑니다.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Vision</h2>
              <p className="text-zinc-400 leading-relaxed">
                대한민국 No.1 화장품 소량제조 플랫폼이 되어, 전 세계에
                K-뷰티의 가치를 전파하는 브랜드들의 든든한 동반자가 됩니다.
                기술과 신뢰로 뷰티 산업의 새로운 표준을 만들어갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="py-20 border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">핵심 가치</h2>
            <p className="text-zinc-400">REDMEDICOS가 추구하는 가치</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-red-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-zinc-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 연혁 */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">연혁</h2>
            <p className="text-zinc-400">REDMEDICOS의 성장 이야기</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-12 pb-8 last:pb-0">
                  <div className="absolute left-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <span className="text-red-500 font-bold">{milestone.year}</span>
                    <p className="text-white mt-1">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 회사 정보 */}
      <section className="py-20 border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">회사 정보</h2>
          </div>
          <div className="max-w-2xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-400">회사명</span>
                <span className="text-white font-medium">REDMEDICOS (레드메디코스)</span>
              </div>
              <div className="flex justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-400">설립일</span>
                <span className="text-white font-medium">2015년</span>
              </div>
              <div className="flex justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-400">대표자</span>
                <span className="text-white font-medium">김대표</span>
              </div>
              <div className="flex justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-400">사업분야</span>
                <span className="text-white font-medium">화장품 OEM/ODM</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-zinc-400">인증</span>
                <span className="text-white font-medium">ISO 22716, CGMP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            함께 시작하실 준비가 되셨나요?
          </h2>
          <p className="text-zinc-400 mb-8">
            REDMEDICOS와 함께 당신만의 브랜드를 시작하세요
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-red-500 transition-colors"
          >
            무료 상담 신청하기
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm">
            © 2024 REDMEDICOS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
