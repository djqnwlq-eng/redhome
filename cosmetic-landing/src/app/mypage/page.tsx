'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Package, Clock, CheckCircle, Truck, Mail, Calendar, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

interface Order {
  id: string;
  productId: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
  createdAt: { seconds: number };
}

const statusLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: '결제 대기', color: 'text-yellow-500', icon: Clock },
  paid: { label: '결제 완료', color: 'text-blue-500', icon: CheckCircle },
  shipped: { label: '배송 중', color: 'text-purple-500', icon: Truck },
  completed: { label: '완료', color: 'text-green-500', icon: CheckCircle },
};

export default function MyPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !isFirebaseConfigured || !db) {
        setLoadingOrders(false);
        return;
      }

      try {
        // 인덱스 없이 쿼리 후 클라이언트에서 정렬
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        // 클라이언트에서 createdAt 기준 내림차순 정렬
        ordersData.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleSaveName = async () => {
    if (!user || !newName.trim() || !db) return;

    setSavingName(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: newName.trim(),
      });
      setEditingName(false);
      // 페이지 새로고침으로 프로필 업데이트 반영
      window.location.reload();
    } catch (error) {
      console.error('Failed to update name:', error);
      alert('이름 변경에 실패했습니다.');
    } finally {
      setSavingName(false);
    }
  };

  const formatDate = (timestamp: { seconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">마이페이지</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 프로필 섹션 */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        placeholder="이름 입력"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={savingName}
                        className="p-1.5 bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
                      >
                        <Save className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingName(false);
                          setNewName('');
                        }}
                        className="p-1.5 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">
                        {userProfile?.displayName || '이름 없음'}
                      </h2>
                      <button
                        onClick={() => {
                          setNewName(userProfile?.displayName || '');
                          setEditingName(true);
                        }}
                        className="p-1 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-zinc-500">
                    {userProfile?.role === 'admin' ? '관리자' : '일반 회원'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">
                    가입일: {user.metadata.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR')
                      : '-'}
                  </span>
                </div>
              </div>

              {userProfile?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-red-500 transition-colors"
                >
                  관리자 대시보드
                </Link>
              )}
            </div>
          </div>

          {/* 주문 내역 섹션 */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold text-white">주문 내역</h2>
              </div>

              {loadingOrders ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 mb-4">아직 주문 내역이 없습니다</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-medium"
                  >
                    상품 둘러보기 →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const status = statusLabels[order.status] || statusLabels.pending;
                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={order.id}
                        className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm text-zinc-500">주문번호</p>
                            <p className="text-white font-medium text-sm">{order.id}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 ${status.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{status.label}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-zinc-700/50">
                          <div>
                            <p className="text-xs text-zinc-500">수량</p>
                            <p className="text-white font-medium">{order.quantity}개</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">결제금액</p>
                            <p className="text-white font-medium">
                              {order.amount.toLocaleString()}원
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">주문일</p>
                            <p className="text-white font-medium text-sm">
                              {order.createdAt ? formatDate(order.createdAt) : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm">© 2024 REDMEDICOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
