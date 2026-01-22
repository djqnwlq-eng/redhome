import HeroSection from '@/components/ui/hero-section-3';
import Problem from '@/components/Problem';
import Solution from '@/components/Solution';
import Features from '@/components/Features';
import LeadForm from '@/components/LeadForm';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  return (
    <div className="min-h-screen w-full antialiased text-white relative bg-zinc-950">
      {/* 히어로 섹션 - REDMEDICOS 브랜딩 */}
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=80"
        logoText="R."
        brandName="REDMEDICOS"
        navLinks={[
          { href: "#problem", label: "고민" },
          { href: "#solution", label: "솔루션" },
          { href: "#features", label: "서비스" },
          { href: "#faq", label: "FAQ" },
          { href: "#contact", label: "상담신청" },
        ]}
        versionText="REDMEDICOS Premium OEM"
        title="당신만의 화장품 브랜드를 시작하세요"
        subtitle="아이디어만 있으면 됩니다. 제형 개발부터 패키지 디자인, 생산까지 전문가가 함께 만들어갑니다. 최소 100개부터 시작 가능합니다."
        ctaText="무료 상담 신청하기"
        typingEnabled={true}
      />

      {/* 나머지 섹션들 */}
      <Problem />
      <Solution />
      <Features />
      <LeadForm />
      <FAQ />
      <FinalCTA />
      <Footer />
      <Chatbot />
    </div>
  );
}
