'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  type: 'bot' | 'user';
  content: string;
  quickReplies?: QuickReply[];
}

interface QuickReply {
  text: string;
  action: string;
}

const chatbotKnowledge: Record<string, string[]> = {
  greetings: ['안녕', '하이', 'hi', 'hello', '반갑', '처음'],
  minOrder: ['최소', '주문량', '몇개', '몇 개', '수량', 'moq'],
  price: ['가격', '비용', '얼마', '견적', '금액', '단가'],
  time: ['기간', '얼마나', '시간', '언제', '납기', '소요'],
  sample: ['샘플', '견본', '테스트'],
  product: ['스킨케어', '메이크업', '립스틱', '크림', '세럼', '화장품', '제품', '뭐', '어떤'],
  consult: ['상담', '문의', '연락', '전화'],
  process: ['과정', '절차', '프로세스', '어떻게'],
  license: ['인허가', '허가', '신고', '등록', '인증'],
};

const chatbotResponses: Record<string, string> = {
  greetings: '안녕하세요! REDMEDICOS입니다.\n\n화장품 브랜드 런칭에 관심이 있으시군요!\n무엇이 궁금하신가요?',
  minOrder: '저희는 **최소 100개**부터 생산이 가능합니다.\n\n초기 브랜드라면 소량으로 시작해서 시장 반응을 먼저 확인해보시는 것을 추천드려요.\n\n수량별 단가가 궁금하시다면 무료 상담을 신청해주세요!',
  price: '제품 종류와 수량에 따라 가격이 달라집니다.\n\n**대략적인 범위:**\n• 스킨케어: 개당 3,000원~\n• 메이크업: 개당 5,000원~\n• 클렌징: 개당 2,500원~\n\n정확한 견적은 무료 상담을 통해 안내드릴게요!',
  time: '제형 개발부터 생산까지 보통 **4~8주** 정도 소요됩니다.\n\n• 기존 제형 사용 시: 2~4주\n• 신규 제형 개발 시: 6~8주\n\n급하신 경우 말씀해주시면 일정을 조율해드릴게요!',
  sample: '네, 샘플 제작 가능합니다.\n\n본 생산 전 샘플로 텍스처, 향, 색상 등을 직접 확인하실 수 있어요.\n\n**좋은 소식:** 본 계약 시 샘플 비용은 전액 차감됩니다!',
  product: '저희가 제조 가능한 제품 카테고리입니다:\n\n**스킨케어** - 토너, 세럼, 크림, 앰플\n**메이크업** - 립스틱, 틴트, 파운데이션\n**클렌징** - 클렌징오일, 폼, 워터\n**선케어** - 선크림, 선스틱\n**바디케어** - 바디로션, 핸드크림\n**헤어케어** - 샴푸, 트리트먼트\n\n어떤 제품에 관심 있으신가요?',
  consult: '무료 상담을 도와드릴게요!\n\n**연락처:**\n• 전화: 02-1234-5678\n• 이메일: contact@redmedicos.kr\n• 운영시간: 평일 09:00-18:00\n\n또는 아래 버튼으로 바로 상담 신청하실 수 있어요!',
  process: '화장품 제작 과정을 안내해드릴게요!\n\n**1단계: 무료 상담**\n원하시는 컨셉과 예산 논의\n\n**2단계: 제형 개발**\n전문 연구원이 맞춤 제형 개발\n\n**3단계: 샘플 확인**\n샘플 테스트 및 피드백 반영\n\n**4단계: 생산 & 납품**\n대량 생산 후 안전 포장 배송',
  license: '화장품 인허가 대행 서비스를 제공합니다.\n\n**대행해드리는 업무:**\n• 화장품책임판매업 등록\n• 제품 신고\n• 전성분 표시 검토\n• 기타 법적 절차\n\n복잡한 인허가 걱정 없이 시작하실 수 있어요!',
  default: '좋은 질문이에요!\n\n더 자세한 상담이 필요하시다면:\n\n전화: 02-1234-5678\n이메일: contact@redmedicos.kr\n\n또는 무료 상담 신청 버튼을 눌러주세요!',
};

const actionTexts: Record<string, string> = {
  minOrder: '최소 주문량이 궁금해요',
  price: '가격이 얼마인가요?',
  time: '제작 기간이 얼마나 걸려요?',
  consult: '상담 받고 싶어요',
  sample: '샘플 만들 수 있나요?',
  product: '어떤 제품을 만들 수 있나요?',
  process: '제작 과정이 어떻게 되나요?',
  license: '인허가는 어떻게 하나요?',
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Auto open after 5 seconds on first visit
    const hasShown = sessionStorage.getItem('chatbotShown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        if (!isOpen) {
          setIsOpen(true);
          sessionStorage.setItem('chatbotShown', 'true');
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const initChatbot = () => {
    if (!initialized) {
      setInitialized(true);
      setTimeout(() => {
        setMessages([
          {
            type: 'bot',
            content: chatbotResponses.greetings,
            quickReplies: [
              { text: '최소 주문량', action: 'minOrder' },
              { text: '제작 비용', action: 'price' },
              { text: '제작 기간', action: 'time' },
              { text: '상담 신청', action: 'consult' },
            ],
          },
        ]);
      }, 500);
    }
  };

  const toggleChatbot = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      initChatbot();
    }
  };

  const findResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    for (const [key, keywords] of Object.entries(chatbotKnowledge)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return key;
      }
    }
    return 'default';
  };

  const getQuickReplies = (action: string): QuickReply[] | undefined => {
    if (action === 'minOrder' || action === 'price') {
      return [
        { text: '샘플 제작', action: 'sample' },
        { text: '제작 과정', action: 'process' },
        { text: '상담 신청', action: 'consult' },
      ];
    }
    if (action === 'consult') {
      return [{ text: '상담 폼으로 이동', action: 'goToForm' }];
    }
    if (action === 'default') {
      return [
        { text: '제품 종류', action: 'product' },
        { text: '제작 과정', action: 'process' },
        { text: '상담 신청', action: 'consult' },
      ];
    }
    return undefined;
  };

  const handleQuickReply = (action: string) => {
    if (action === 'goToForm') {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      setMessages((prev) => [
        ...prev.map((m) => ({ ...m, quickReplies: undefined })),
        { type: 'user' as const, content: '상담 폼으로 이동' },
      ]);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: '상담 신청 폼으로 이동했어요!\n\n양식을 작성해주시면 24시간 내 연락드릴게요.',
          },
        ]);
        setTimeout(() => setIsOpen(false), 500);
      }, 1000);
      return;
    }

    const userText = actionTexts[action] || action;
    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, quickReplies: undefined })),
      { type: 'user', content: userText },
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = chatbotResponses[action] || chatbotResponses.default;
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: response, quickReplies: getQuickReplies(action) },
      ]);
    }, 1000 + Math.random() * 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, quickReplies: undefined })),
      { type: 'user', content: userMessage },
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responseKey = findResponse(userMessage);
      const response = chatbotResponses[responseKey];
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: response, quickReplies: getQuickReplies(responseKey) },
      ]);
    }, 1000 + Math.random() * 500);
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div
        className={`absolute bottom-20 right-0 w-96 max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-150px)] bg-zinc-800 rounded-2xl border border-zinc-700 flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
          isOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-5 scale-95'
        }`}
      >
        {/* Header */}
        <div className="bg-zinc-900 px-5 py-4 flex items-center gap-3 border-b border-zinc-700">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
            R
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">REDMEDICOS 상담</h4>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              온라인
            </p>
          </div>
          <button
            onClick={toggleChatbot}
            className="w-8 h-8 bg-zinc-800 rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-white transition-all flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={message.type === 'user' ? 'flex justify-end' : 'flex gap-2'}>
              {message.type === 'bot' && (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                  R
                </div>
              )}
              <div>
                <div
                  className={
                    message.type === 'user'
                      ? 'bg-red-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%]'
                      : 'bg-zinc-900 px-4 py-3 rounded-2xl rounded-tl-sm text-sm'
                  }
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                {message.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.quickReplies.map((qr, qrIndex) => (
                      <button
                        key={qrIndex}
                        onClick={() => handleQuickReply(qr.action)}
                        className="px-4 py-2 bg-zinc-800 border border-red-500 text-red-500 rounded-full text-xs hover:bg-red-500 hover:text-white transition-all"
                      >
                        {qr.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                R
              </div>
              <div className="bg-zinc-900 px-5 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-[typingBounce_1.4s_infinite]" />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-[typingBounce_1.4s_infinite_0.2s]" />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-[typingBounce_1.4s_infinite_0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-700 bg-zinc-900">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-11 h-11 bg-red-500 rounded-xl text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              ➤
            </button>
          </form>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleChatbot}
        className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-xl text-white font-semibold shadow-lg shadow-red-500/30 hover:scale-110 transition-transform relative"
      >
        {!isOpen && (
          <span className="absolute inset-0 bg-red-500 rounded-full animate-[pulse_2s_infinite]" />
        )}
        <span className="relative z-10">{isOpen ? '✕' : '?'}</span>
      </button>
    </div>
  );
}
