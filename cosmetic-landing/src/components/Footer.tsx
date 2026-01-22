'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-16 px-8 bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <span className="text-2xl font-bold text-red-500 block mb-4">REDMEDICOS</span>
            <p className="text-zinc-500 text-sm">
              소량 맞춤 화장품 제조 전문
              <br />
              당신만의 브랜드를 함께 만듭니다
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
                  스킨케어 제조
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
                  메이크업 제조
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
                  클렌징 제조
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
                  선케어 제조
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#faq" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
                  상담 신청
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
                  제작 가이드
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
                  포트폴리오
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">연락처</h4>
            <div className="space-y-2 text-zinc-500 text-sm">
              <p>Tel. 02-1234-5678</p>
              <p>Email. contact@redmedicos.kr</p>
              <p>서울시 강남구 테헤란로 123</p>
              <p>평일 09:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">© 2024 REDMEDICOS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="#" className="text-zinc-500 text-sm hover:text-red-500 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
