'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  details?: string;
  ingredients?: string;
}

// 데모 상품 데이터
const demoProducts: Record<string, Product> = {
  'test-100': {
    id: 'test-100',
    name: '[테스트] 결제 테스트 상품',
    description: '결제 테스트용 1원 상품입니다',
    price: 1,
    image: 'https://images.unsplash.com/photo-1607004468138-e7e23ea26947?w=800',
    category: '스킨케어',
    details: '이 상품은 TossPayments 결제 테스트를 위한 1원짜리 상품입니다. 실제 배송되지 않습니다.',
    ingredients: '테스트 성분',
  },
  'demo-1': {
    id: 'demo-1',
    name: '하이드레이팅 토너',
    description: '히알루론산 함유 고보습 토너',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    category: '스킨케어',
    details: '3중 히알루론산이 피부 깊숙이 수분을 공급하여 촉촉하고 탄력있는 피부로 가꿔줍니다. 저자극 포뮬러로 민감한 피부도 안심하고 사용할 수 있습니다.',
    ingredients: '정제수, 히알루론산, 글리세린, 판테놀, 알란토인, 나이아신아마이드',
  },
  'demo-2': {
    id: 'demo-2',
    name: '비타민C 세럼',
    description: '브라이트닝 효과의 고농축 비타민C',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
    category: '스킨케어',
    details: '안정화된 비타민C 유도체가 피부톤을 환하게 밝혀주고, 항산화 효과로 피부 노화를 방지합니다. 매끄럽고 윤기나는 피부로 가꿔줍니다.',
    ingredients: '정제수, 아스코빌글루코사이드, 나이아신아마이드, 히알루론산, 토코페롤',
  },
  'demo-3': {
    id: 'demo-3',
    name: '수분 크림',
    description: '세라마이드 함유 장벽강화 크림',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=800',
    category: '스킨케어',
    details: '5가지 세라마이드 복합체가 피부 장벽을 강화하고 수분 손실을 방지합니다. 풍부한 영양감으로 건조한 피부를 깊이 케어합니다.',
    ingredients: '정제수, 세라마이드NP, 세라마이드AP, 세라마이드EOP, 시어버터, 스쿠알란',
  },
  'demo-4': {
    id: 'demo-4',
    name: '선스크린 SPF50+',
    description: '무기자차 선크림',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=800',
    category: '선케어',
    details: '자연유래 무기 자외선 차단제로 피부에 자극 없이 강력한 자외선 차단 효과를 제공합니다. 백탁 현상이 적고 촉촉한 사용감.',
    ingredients: '정제수, 징크옥사이드, 티타늄디옥사이드, 나이아신아마이드, 히알루론산',
  },
  'demo-5': {
    id: 'demo-5',
    name: '클렌징 오일',
    description: '저자극 딥클렌징 오일',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
    category: '클렌징',
    details: '식물성 오일이 메이크업과 노폐물을 부드럽게 녹여내고, 물과 만나면 부드러운 밀크 제형으로 변환됩니다. 세안 후에도 당김 없이 촉촉함을 유지합니다.',
    ingredients: '호호바씨오일, 올리브오일, 동백오일, 토코페롤, 라벤더오일',
  },
  'demo-6': {
    id: 'demo-6',
    name: '립 틴트',
    description: '롱래스팅 벨벳 립틴트',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
    category: '메이크업',
    details: '선명한 발색력과 벨벳 텍스처로 입술에 자연스럽게 스며듭니다. 보습 성분이 함유되어 입술이 건조하지 않고 촉촉하게 유지됩니다.',
    ingredients: '디메티콘, 디이소스테아릴말레이트, 마이크로크리스탈린왁스, 시어버터, 비타민E',
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(100); // 최소 주문 수량
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params.id as string;

      // Firebase가 설정되지 않은 경우 데모 데이터 사용
      if (!isFirebaseConfigured || !db) {
        const demoProduct = demoProducts[productId];
        if (demoProduct) {
          setProduct(demoProduct);
        } else {
          router.push('/products');
        }
        setLoading(false);
        return;
      }

      try {
        // Firestore에서 조회
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          // Firestore에 없으면 데모 데이터에서 조회
          const demoProduct = demoProducts[productId];
          if (demoProduct) {
            setProduct(demoProduct);
          } else {
            // 상품을 찾을 수 없음
            router.push('/products');
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        // 에러 발생시 데모 데이터에서 조회
        const demoProduct = demoProducts[params.id as string];
        if (demoProduct) {
          setProduct(demoProduct);
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const handlePayment = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!product) return;

    setPaying(true);

    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

      if (!clientKey) {
        alert('결제 시스템이 설정되지 않았습니다. 관리자에게 문의하세요.');
        setPaying(false);
        return;
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: user.uid });

      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const totalAmount = product.price * quantity;

      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: totalAmount,
        },
        orderId,
        orderName: `${product.name} ${quantity}개`,
        successUrl: `${window.location.origin}/payment/success?productId=${product.id}&quantity=${quantity}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: user.email || undefined,
        customerName: user.displayName || '고객',
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 중 오류가 발생했습니다.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const totalPrice = product.price * quantity;

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
              href="/products"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">상품 목록</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 상품 상세 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* 이미지 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="text-sm font-medium text-white bg-red-500 px-3 py-1.5 rounded-full">
                  {product.category}
                </span>
              </div>
            </div>

            {/* 정보 */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-3">{product.name}</h1>
              <p className="text-lg text-zinc-400 mb-6">{product.description}</p>

              <div className="text-3xl font-bold text-red-500 mb-8">
                {product.price.toLocaleString()}원
                <span className="text-sm font-normal text-zinc-500 ml-2">/ 개당</span>
              </div>

              {/* 상세 설명 */}
              {product.details && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-3">상품 설명</h3>
                  <p className="text-zinc-300 leading-relaxed">{product.details}</p>
                </div>
              )}

              {/* 성분 */}
              {product.ingredients && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-3">주요 성분</h3>
                  <p className="text-zinc-300">{product.ingredients}</p>
                </div>
              )}

              {/* 수량 선택 */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-4">주문 수량</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(100, quantity - 100))}
                    className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="number"
                      min={100}
                      step={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(100, parseInt(e.target.value) || 100))}
                      className="w-full text-center text-xl font-bold text-white bg-transparent border-none focus:outline-none"
                    />
                    <p className="text-xs text-zinc-500 text-center mt-1">최소 주문 100개</p>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 100)}
                    className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 총 금액 */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">총 결제 금액</span>
                  <span className="text-2xl font-bold text-white">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 결제 버튼 */}
              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    결제 진행중...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {user ? '결제하기' : '로그인 후 결제하기'}
                  </>
                )}
              </button>

              {!user && (
                <p className="text-center text-sm text-zinc-500 mt-3">
                  결제를 위해{' '}
                  <Link href="/login" className="text-red-500 hover:underline">
                    로그인
                  </Link>
                  이 필요합니다
                </p>
              )}

              {user && (
                <p className="text-center text-xs text-zinc-600 mt-3">
                  📱 모바일 결제 시 결제 완료 후 브라우저로 직접 돌아와주세요
                </p>
              )}

              {/* 안내사항 */}
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-2 text-sm text-zinc-500">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>OEM/ODM 주문 제작 상품입니다</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-zinc-500">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>제조 기간은 약 2-4주 소요됩니다</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-zinc-500">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>패키지 커스터마이징 가능</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm">© 2024 REDMEDICOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
