'use client';

import { useState } from 'react';

// Google Apps Script 웹앱 URL (배포 후 여기에 URL을 입력하세요)
const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

const categories = [
  { value: 'skincare', label: '스킨케어' },
  { value: 'makeup', label: '메이크업' },
  { value: 'cleansing', label: '클렌징' },
  { value: 'suncare', label: '선케어' },
  { value: 'bodycare', label: '바디케어' },
  { value: 'haircare', label: '헤어케어' },
];

export default function LeadForm() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      categories: selectedCategories,
      quantity: formData.get('quantity') as string,
      message: formData.get('message') as string,
      privacy: privacyChecked,
    };

    try {
      // Google Apps Script로 데이터 전송
      if (GOOGLE_SCRIPT_URL) {
        // URL 인코딩된 form data로 전송 (Google Apps Script 호환)
        const params = new URLSearchParams();
        params.append('name', data.name);
        params.append('phone', data.phone);
        params.append('email', data.email);
        params.append('categories', data.categories.join(', '));
        params.append('quantity', data.quantity);
        params.append('message', data.message);
        params.append('privacy', data.privacy ? 'Y' : 'N');

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 처리
        console.log('Data sent to Google Sheets');
      } else {
        // URL이 없으면 콘솔에만 출력 (개발용)
        console.log('Lead Data:', data);
      }

      setShowModal(true);
      form.reset();
      setSelectedCategories([]);
      setPrivacyChecked(false);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className="py-24 px-8 bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-800 rounded-3xl p-8 md:p-12 border border-zinc-700 relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />

            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">무료 상담 신청</h2>
              <p className="text-zinc-500">전문 상담사가 24시간 내 연락드립니다</p>
            </div>

            {/* Welcome Message */}
            <div className="flex gap-4 mb-8 animate-[slideIn_0.5s_ease]">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
                R
              </div>
              <div className="bg-zinc-900 px-6 py-4 rounded-2xl rounded-tl-sm max-w-[80%]">
                <p className="text-sm mb-1">안녕하세요! REDMEDICOS입니다.</p>
                <p className="text-sm text-zinc-400">
                  화장품 브랜드 런칭에 관심이 있으시군요! 몇 가지 정보만 알려주시면 전문 상담사가 맞춤 견적을 안내해드릴게요.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-500 mb-2">이름 / 회사명 *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="홍길동 / 뷰티브랜드"
                  required
                  className="w-full px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-500 mb-2">연락처 *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="010-0000-0000"
                    required
                    className="w-full px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 mb-2">이메일 *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    required
                    className="w-full px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-500 mb-2">관심 제품 카테고리 (복수 선택 가능)</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value)}
                      className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                        selectedCategories.includes(cat.value)
                          ? 'bg-red-500/20 border-red-500 text-red-500'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-red-500'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-500 mb-2">예상 주문 수량</label>
                <select
                  name="quantity"
                  className="w-full px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all appearance-none"
                >
                  <option value="">선택해주세요</option>
                  <option value="100-500">100개 ~ 500개</option>
                  <option value="500-1000">500개 ~ 1,000개</option>
                  <option value="1000-3000">1,000개 ~ 3,000개</option>
                  <option value="3000+">3,000개 이상</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-500 mb-2">제품 컨셉 또는 추가 문의사항</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="원하시는 제품 컨셉, 타겟 고객층, 특별히 원하시는 성분 등을 자유롭게 적어주세요."
                  className="w-full px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacy"
                    required
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      privacyChecked ? 'bg-red-500 border-red-500' : 'border-zinc-600'
                    }`}
                  >
                    {privacyChecked && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </span>
                  <span className="text-sm text-zinc-400">개인정보 수집 및 이용에 동의합니다 (필수)</span>
                </label>
              </div>

              {submitError && (
                <p className="text-center text-sm text-red-400 bg-red-500/10 py-3 rounded-xl">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-semibold text-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    전송 중...
                  </span>
                ) : (
                  '무료 상담 신청하기 →'
                )}
              </button>

              <p className="text-center text-sm text-zinc-500">
                입력하신 정보는 상담 목적으로만 사용되며 안전하게 보호됩니다
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-zinc-800 p-12 rounded-3xl text-center max-w-md border border-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-6">
              ✓
            </div>
            <h3 className="text-2xl font-bold mb-4">상담 신청 완료!</h3>
            <p className="text-zinc-500 mb-8">
              소중한 정보 감사합니다.
              <br />
              24시간 내 전문 상담사가 연락드리겠습니다.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
