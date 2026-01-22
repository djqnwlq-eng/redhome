'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, X, ChevronDown } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
  paymentKey?: string;
  createdAt: { seconds: number };
}

const statusOptions = [
  { value: 'pending', label: '결제 대기', color: 'bg-yellow-500/10 text-yellow-500' },
  { value: 'paid', label: '결제 완료', color: 'bg-blue-500/10 text-blue-500' },
  { value: 'shipped', label: '배송 중', color: 'bg-purple-500/10 text-purple-500' },
  { value: 'completed', label: '완료', color: 'bg-green-500/10 text-green-500' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!db) return;
    setUpdating(orderId);

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('상태 변경에 실패했습니다.');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (timestamp: { seconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusStyle = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.color || 'bg-zinc-500/10 text-zinc-500';
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.label || status;
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
      <h1 className="text-2xl font-bold text-white mb-8">주문 관리</h1>

      {orders.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">아직 주문이 없습니다</p>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase">
                  주문번호
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase">
                  고객
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase">
                  수량
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase">
                  금액
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase">
                  상태
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase">
                  일시
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-zinc-400 uppercase">
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-zinc-800/50">
                  <td className="py-4 px-6 text-sm text-white font-medium">
                    <span className="font-mono">{order.id.slice(0, 16)}...</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-400">
                    {order.userEmail || '-'}
                  </td>
                  <td className="py-4 px-6 text-sm text-white">{order.quantity}개</td>
                  <td className="py-4 px-6 text-sm text-white font-medium">
                    {order.amount?.toLocaleString()}원
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-full cursor-pointer ${getStatusStyle(
                          order.status
                        )} bg-transparent border border-current/30 focus:outline-none`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value} className="bg-zinc-900">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      {updating === order.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 rounded-full">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-400">
                    {order.createdAt ? formatDate(order.createdAt) : '-'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 주문 상세 모달 */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">주문 상세</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-zinc-500">주문번호</p>
                <p className="text-white font-mono text-sm">{selectedOrder.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500">고객 이메일</p>
                  <p className="text-white">{selectedOrder.userEmail || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">사용자 ID</p>
                  <p className="text-white text-sm font-mono truncate">
                    {selectedOrder.userId || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500">수량</p>
                  <p className="text-white font-medium">{selectedOrder.quantity}개</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">결제 금액</p>
                  <p className="text-white font-medium">
                    {selectedOrder.amount?.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500">상태</p>
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full mt-1 ${getStatusStyle(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">주문 일시</p>
                  <p className="text-white text-sm">
                    {selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : '-'}
                  </p>
                </div>
              </div>

              {selectedOrder.paymentKey && (
                <div>
                  <p className="text-sm text-zinc-500">결제 키</p>
                  <p className="text-white text-xs font-mono break-all">
                    {selectedOrder.paymentKey}
                  </p>
                </div>
              )}

              {selectedOrder.productId && (
                <div>
                  <p className="text-sm text-zinc-500">상품 ID</p>
                  <p className="text-white text-sm font-mono">{selectedOrder.productId}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-zinc-800">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
