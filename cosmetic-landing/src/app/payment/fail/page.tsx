'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">결제에 실패했습니다</h1>
        <p className="text-zinc-400 mb-2">
          결제 처리 중 문제가 발생했습니다.
        </p>
        {errorMessage && (
          <p className="text-zinc-500 text-sm mb-8">
            {decodeURIComponent(errorMessage)}
          </p>
        )}

        {errorCode && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8">
            <span className="text-zinc-500 text-sm">오류 코드: </span>
            <span className="text-zinc-300 text-sm">{errorCode}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-800 text-white font-semibold px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-500 transition-colors"
          >
            홈으로 가기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-zinc-600 text-xs mt-8">
          문제가 지속되면 고객센터로 문의해주세요.
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
