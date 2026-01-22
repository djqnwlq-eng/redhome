'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Settings, Sparkles, ExternalLink, Check, Trash2 } from 'lucide-react';

interface Message {
  type: 'bot' | 'user';
  content: string;
  quickReplies?: QuickReply[];
}

interface QuickReply {
  text: string;
  action: string;
}

const SYSTEM_PROMPT = `당신은 REDMEDICOS의 AI 상담원입니다. 화장품 소량 제조(OEM/ODM) 전문 회사의 고객 상담을 담당합니다.

**회사 정보:**
- 회사명: REDMEDICOS
- 서비스: 화장품 소량 제조 (OEM/ODM)
- 최소 주문량: 100개부터 가능
- 제작 기간: 4~8주 (기존 제형 2~4주, 신규 개발 6~8주)
- 연락처: 02-1234-5678
- 이메일: contact@redmedicos.kr
- 운영시간: 평일 09:00-18:00

**제조 가능 제품:**
- 스킨케어: 토너, 세럼, 크림, 앰플
- 메이크업: 립스틱, 틴트, 파운데이션
- 클렌징: 클렌징오일, 폼, 워터
- 선케어: 선크림, 선스틱
- 바디케어: 바디로션, 핸드크림
- 헤어케어: 샴푸, 트리트먼트

**가격 범위:**
- 스킨케어: 개당 3,000원~
- 메이크업: 개당 5,000원~
- 클렌징: 개당 2,500원~

**서비스 특징:**
- 1:1 전담 매니저 배정
- 샘플 제작 가능 (본 계약 시 비용 차감)
- 인허가 대행 서비스 제공
- 패키지 디자인 지원

**응답 가이드라인:**
1. 친절하고 전문적인 톤 유지
2. 한국어로 답변
3. 간결하면서도 필요한 정보 제공
4. 구체적인 견적은 무료 상담 신청 유도
5. 마크다운 형식 사용 가능 (**굵게**, 줄바꿈)
6. 답변은 200자 이내로 간결하게`;

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
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{role: string; parts: {text: string}[]}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeyValid(true);
    }
  }, []);

  useEffect(() => {
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

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('geminiApiKey', apiKey.trim());
      setIsApiKeyValid(true);
      setShowApiKeyInput(false);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('geminiApiKey');
    setApiKey('');
    setIsApiKeyValid(false);
    setConversationHistory([]);
  };

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    const newHistory = [
      ...conversationHistory,
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: newHistory,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API Error Response:', response.status, errorData);

        if (response.status === 400 || response.status === 403 || response.status === 401) {
          setIsApiKeyValid(false);
          return 'API 키가 유효하지 않습니다. 키를 다시 확인해주세요.';
        }
        if (response.status === 404) {
          return '모델을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.';
        }
        if (response.status === 429) {
          return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        }
        // 그 외 에러는 기본 응답으로 폴백
        return '';
      }

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 생성하지 못했습니다.';

      setConversationHistory([
        ...newHistory,
        { role: 'model', parts: [{ text: botResponse }] }
      ]);

      return botResponse;
    } catch (error) {
      console.error('Gemini API Error:', error);
      // 네트워크 에러 등의 경우 빈 문자열 반환하여 기본 응답으로 폴백
      return '';
    }
  };

  const initChatbot = () => {
    if (!initialized) {
      setInitialized(true);
      setTimeout(() => {
        setMessages([
          {
            type: 'bot',
            content: isApiKeyValid
              ? '안녕하세요! REDMEDICOS AI 상담원입니다.\n\n**Gemini 2.5 Flash**가 연결되었습니다.\n화장품 제조에 관해 무엇이든 물어보세요!'
              : '안녕하세요! REDMEDICOS입니다.\n\n화장품 브랜드 런칭에 관심이 있으시군요!\n\n💡 **상단의 AI 상담 활성화** 버튼을 누르면\n더 똑똑한 AI 상담을 받으실 수 있어요!',
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
    if (newState) initChatbot();
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

  const handleQuickReply = async (action: string) => {
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

    if (isApiKeyValid) {
      const aiResponse = await callGeminiAPI(userText);
      setIsTyping(false);
      if (aiResponse) {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', content: aiResponse, quickReplies: getQuickReplies(action) },
        ]);
        return;
      }
    }

    setTimeout(() => {
      setIsTyping(false);
      const response = chatbotResponses[action] || chatbotResponses.default;
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: response, quickReplies: getQuickReplies(action) },
      ]);
    }, 1000 + Math.random() * 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, quickReplies: undefined })),
      { type: 'user', content: userMessage },
    ]);

    setIsTyping(true);

    if (isApiKeyValid) {
      const aiResponse = await callGeminiAPI(userMessage);
      setIsTyping(false);
      if (aiResponse) {
        const responseKey = findResponse(userMessage);
        setMessages((prev) => [
          ...prev,
          { type: 'bot', content: aiResponse, quickReplies: getQuickReplies(responseKey) },
        ]);
        return;
      }
    }

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
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-400">$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div
        className={`absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-48px)] bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800/50 flex flex-col overflow-hidden transition-all duration-500 ease-out ${
          isOpen
            ? 'opacity-100 visible translate-y-0 scale-100 shadow-2xl shadow-black/50'
            : 'opacity-0 invisible translate-y-4 scale-95'
        }`}
        style={{ height: '560px', maxHeight: 'calc(100vh - 140px)' }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-500 px-5 py-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjA1IiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-base">REDMEDICOS</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isApiKeyValid ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                <span className="text-white/80 text-xs font-medium">
                  {isApiKeyValid ? 'Gemini 2.5 Flash 연결됨' : '기본 상담 모드'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                showApiKeyInput
                  ? 'bg-white/30 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Settings size={18} />
            </button>
            <button
              onClick={toggleChatbot}
              className="w-9 h-9 bg-white/10 rounded-xl text-white/70 hover:bg-white/20 hover:text-white transition-all flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* AI 연결 버튼 - API 키 미설정시 상단에 표시 */}
        {!isApiKeyValid && !showApiKeyInput && (
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-3 border-b border-blue-500/20">
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <Sparkles size={16} />
              <span>AI 상담 활성화하기</span>
            </button>
            <p className="text-xs text-zinc-400 text-center mt-2">
              Gemini 2.5 Flash로 더 똑똑한 상담을 받아보세요
            </p>
          </div>
        )}

        {/* API Key Section */}
        {showApiKeyInput && (
          <div className="bg-zinc-900/95 backdrop-blur-sm px-5 py-4 border-b border-zinc-800/50 max-h-[280px] overflow-y-auto">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="text-base text-white font-semibold">Gemini 2.5 Flash 연동</p>
                <p className="text-xs text-zinc-400 mt-1">무료 API 키로 AI 상담을 활성화하세요</p>
              </div>
            </div>

            {/* 단계별 가이드 */}
            <div className="bg-zinc-800/50 rounded-xl p-4 mb-4 border border-zinc-700/30">
              <p className="text-xs text-zinc-300 font-medium mb-3">📌 API 키 발급 방법 (무료)</p>
              <ol className="space-y-2 text-xs text-zinc-400">
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
                  <span>Google 계정으로 AI Studio 접속</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
                  <span>&quot;Get API Key&quot; 버튼 클릭</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
                  <span>&quot;Create API Key&quot; 선택 후 복사</span>
                </li>
              </ol>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-all"
              >
                <ExternalLink size={12} />
                <span>Google AI Studio 바로가기</span>
              </a>
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API 키를 붙여넣기 하세요..."
                className="flex-1 px-4 py-2.5 bg-zinc-800/80 border border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
              />
              {isApiKeyValid ? (
                <button
                  onClick={clearApiKey}
                  className="px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all flex items-center gap-2"
                >
                  <Trash2 size={14} />
                </button>
              ) : (
                <button
                  onClick={saveApiKey}
                  disabled={!apiKey.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  연결
                </button>
              )}
            </div>

            {isApiKeyValid && (
              <div className="flex items-center gap-2 mt-3 text-xs text-green-400">
                <Check size={14} />
                <span>Gemini 2.5 Flash가 연결되었습니다!</span>
              </div>
            )}

            <button
              onClick={() => setShowApiKeyInput(false)}
              className="w-full mt-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              나중에 하기
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'gap-3'}`}
            >
              {message.type === 'bot' && (
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-red-500/20">
                  R
                </div>
              )}
              <div className={message.type === 'user' ? 'max-w-[80%]' : 'flex-1 max-w-[85%]'}>
                <div
                  className={
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-2xl rounded-br-md text-sm shadow-lg shadow-red-500/20'
                      : 'bg-zinc-800/80 border border-zinc-700/30 px-4 py-3 rounded-2xl rounded-tl-md text-sm text-zinc-200'
                  }
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                {message.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.quickReplies.map((qr, qrIndex) => (
                      <button
                        key={qrIndex}
                        onClick={() => handleQuickReply(qr.action)}
                        className="px-4 py-2 bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 rounded-full text-xs font-medium hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
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
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-red-500/20">
                R
              </div>
              <div className="bg-zinc-800/80 border border-zinc-700/30 px-5 py-4 rounded-2xl rounded-tl-md flex items-center gap-1.5">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-[typingBounce_1.4s_infinite]" />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-[typingBounce_1.4s_infinite_0.2s]" />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-[typingBounce_1.4s_infinite_0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800/50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-3 bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white flex items-center justify-center hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleChatbot}
        className={`group w-16 h-16 rounded-2xl flex items-center justify-center text-white font-semibold shadow-xl transition-all duration-300 ${
          isOpen
            ? 'bg-zinc-800 hover:bg-zinc-700 rotate-0'
            : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/40 hover:scale-110'
        }`}
      >
        {!isOpen && (
          <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl animate-ping opacity-20" />
        )}
        <span className="relative z-10 transition-transform duration-300">
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </span>
      </button>
    </div>
  );
}
