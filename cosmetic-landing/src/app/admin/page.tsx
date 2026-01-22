'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  userEmail: string;
  amount: number;
  status: string;
  createdAt: { seconds: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isFirebaseConfigured || !db) {
        setStats({
          totalProducts: 6,
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
        });
        setLoading(false);
        return;
      }

      try {
        // 상품 수
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        // 주문 수 및 총 매출
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const totalOrders = ordersSnapshot.size;
        let totalRevenue = 0;
        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'paid' || data.status === 'completed') {
            totalRevenue += data.amount || 0;
          }
        });

        // 사용자 수
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        setStats({
          totalProducts: totalProducts || 6, // 데모 상품 수
          totalOrders,
          totalUsers,
          totalRevenue,
        });

        // 최근 주문 5개
        const recentOrdersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
        const orders = recentOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RecentOrder[];
        setRecentOrders(orders);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (timestamp: { seconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: '대기', color: 'bg-yellow-500/10 text-yellow-500' },
    paid: { label: '결제완료', color: 'bg-blue-500/10 text-blue-500' },
    shipped: { label: '배송중', color: 'bg-purple-500/10 text-purple-500' },
    completed: { label: '완료', color: 'bg-green-500/10 text-green-500' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">전체 상품</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">전체 주문</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">전체 회원</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">총 매출</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalRevenue.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 주문 */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">최근 주문</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            전체 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">아직 주문이 없습니다</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">
                    주문번호
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">
                    고객
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">
                    금액
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">
                    상태
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase">
                    일시
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const status = statusLabels[order.status] || statusLabels.pending;
                  return (
                    <tr key={order.id} className="border-b border-zinc-800/50">
                      <td className="py-3 px-4 text-sm text-white font-medium">
                        {order.id.slice(0, 12)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-400">
                        {order.userEmail || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-white">
                        {order.amount?.toLocaleString()}원
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-400">
                        {order.createdAt ? formatDate(order.createdAt) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 빠른 액션 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <Link
          href="/admin/products"
          className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-red-500/50 transition-colors group"
        >
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <Package className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold">상품 관리</h3>
            <p className="text-sm text-zinc-400">상품 추가, 수정, 삭제</p>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-600 ml-auto group-hover:text-red-500 transition-colors" />
        </Link>

        <Link
          href="/admin/orders"
          className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-red-500/50 transition-colors group"
        >
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <ShoppingCart className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold">주문 관리</h3>
            <p className="text-sm text-zinc-400">주문 확인 및 상태 변경</p>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-600 ml-auto group-hover:text-red-500 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
