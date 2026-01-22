'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');
  const isConfirming = useRef(false);
  const isConfirmed = useRef(false);

  useEffect(() => {
    const confirmPayment = async () => {
      // 이미 처리 중이거나 완료된 경우 스킵
      if (isConfirming.current || isConfirmed.current) {
        return;
      }

      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const productId = searchParams.get('productId');
      const quantity = searchParams.get('quantity');

      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setProcessing(false);
        return;
      }

      // 이미 처리된 주문인지 확인
      if (db) {
        try {
          const orderDoc = await getDoc(doc(db, 'orders', orderId));
          if (orderDoc.exists()) {
            // 이미 저장된 주문 - 성공으로 처리
            isConfirmed.current = true;
            setProcessing(false);
            return;
          }
        } catch (e) {
          console.log('Order check failed, proceeding with confirmation');
        }
      }

      isConfirming.current = true;

      try {
        // 서버에서 결제 승인
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        });

        const data = await response.json();

        // S008 에러는 이미 처리된 결제 - 성공으로 처리
        if (!response.ok) {
          if (data.message?.includes('S008') || data.message?.includes('기존 요청')) {
            // 이미 처리된 결제 - Firestore에 저장 시도
            if (user && db) {
              try {
                await setDoc(doc(db, 'orders', orderId), {
                  userId: user.uid,
                  userEmail: user.email,
                  productId: productId || '',
                  quantity: parseInt(quantity || '100'),
                  amount: parseInt(amount),
                  paymentKey,
                  status: 'paid',
                  createdAt: serverTimestamp(),
                }, { merge: true });
              } catch (e) {
                console.log('Order already exists or save failed');
              }
            }
            isConfirmed.current = true;
            setProcessing(false);
            return;
          }
          throw new Error(data.message || '결제 승인에 실패했습니다.');
        }

        // Firestore에 주문 정보 저장
        if (user && db) {
          await setDoc(doc(db, 'orders', orderId), {
            userId: user.uid,
            userEmail: user.email,
            productId: productId || '',
            quantity: parseInt(quantity || '100'),
            amount: parseInt(amount),
            paymentKey,
            status: 'paid',
            createdAt: serverTimestamp(),
          });
        }

        isConfirmed.current = true;
        setProcessing(false);
      } catch (err) {
        console.error('Payment confirmation error:', err);
        setError(err instanceof Error ? err.message : '결제 승인에 실패했습니다.');
        setProcessing(false);
      } finally {
        isConfirming.current = false;
      }
    };

    confirmPayment();
  }, [searchParams, user]);

  if (processing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">결제 확인 중 오류 발생</h1>
          <p className="text-zinc-400 mb-8">{error}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-500 transition-colors"
          >
            상품 목록으로
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">결제가 완료되었습니다!</h1>
        <p className="text-zinc-400 mb-2">
          주문이 성공적으로 접수되었습니다.
        </p>
        <p className="text-zinc-500 text-sm mb-8">
          주문 내역은 마이페이지에서 확인하실 수 있습니다.
        </p>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="flex justify-between py-2 border-b border-zinc-800">
            <span className="text-zinc-400">주문번호</span>
            <span className="text-white font-medium text-sm">
              {searchParams.get('orderId')}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-zinc-400">결제금액</span>
            <span className="text-white font-bold">
              {parseInt(searchParams.get('amount') || '0').toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/mypage"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-800 text-white font-semibold px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            주문 내역 보기
          </Link>
          <Link
            href="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-500 transition-colors"
          >
            쇼핑 계속하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
