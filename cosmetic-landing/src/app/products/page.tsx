'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Search, Filter } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// 데모 상품 (Firebase 미설정시 사용)
const demoProducts: Product[] = [
  {
    id: 'test-100',
    name: '[테스트] 결제 테스트 상품',
    description: '결제 테스트용 1원 상품입니다',
    price: 1,
    image: 'https://images.unsplash.com/photo-1607004468138-e7e23ea26947?w=400',
    category: '스킨케어',
  },
  {
    id: 'demo-1',
    name: '하이드레이팅 토너',
    description: '히알루론산 함유 고보습 토너',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    category: '스킨케어',
  },
  {
    id: 'demo-2',
    name: '비타민C 세럼',
    description: '브라이트닝 효과의 고농축 비타민C',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    category: '스킨케어',
  },
  {
    id: 'demo-3',
    name: '수분 크림',
    description: '세라마이드 함유 장벽강화 크림',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400',
    category: '스킨케어',
  },
  {
    id: 'demo-4',
    name: '선스크린 SPF50+',
    description: '무기자차 선크림',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400',
    category: '선케어',
  },
  {
    id: 'demo-5',
    name: '클렌징 오일',
    description: '저자극 딥클렌징 오일',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    category: '클렌징',
  },
  {
    id: 'demo-6',
    name: '립 틴트',
    description: '롱래스팅 벨벳 립틴트',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
    category: '메이크업',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const categories = ['전체', '스킨케어', '선케어', '클렌징', '메이크업'];

  useEffect(() => {
    const fetchProducts = async () => {
      // Firebase가 설정되지 않은 경우 데모 데이터 사용
      if (!isFirebaseConfigured || !db) {
        setProducts(demoProducts);
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          // Firestore에 데이터가 없으면 데모 데이터 사용
          setProducts(demoProducts);
        } else {
          const productsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[];
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // 에러 발생시 데모 데이터 사용
        setProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      {/* 히어로 */}
      <section className="py-16 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">상품 소개</h1>
              <p className="text-zinc-400 mt-1">REDMEDICOS OEM/ODM 상품</p>
            </div>
          </div>

          {/* 검색 & 필터 */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="상품명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-zinc-500" />
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상품 그리드 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden bg-zinc-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-medium text-white bg-red-500/90 px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                      <span className="text-lg font-bold text-red-500">
                        {product.price.toLocaleString()}원
                      </span>
                      <span className="text-xs text-zinc-500 group-hover:text-red-400 transition-colors">
                        상세보기 →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 안내 문구 */}
      <section className="py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm">
            * 모든 제품은 OEM/ODM 주문 제작 상품입니다. 최소 주문 수량 100개부터 가능합니다.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 mt-4 text-sm font-medium"
          >
            맞춤 제작 상담받기 →
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm">© 2024 REDMEDICOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
