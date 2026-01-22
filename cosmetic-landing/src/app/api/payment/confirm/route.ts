import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { message: '결제 시스템 설정이 올바르지 않습니다.' },
        { status: 500 }
      );
    }

    // TossPayments 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('TossPayments error:', data);
      return NextResponse.json(
        { message: data.message || '결제 승인에 실패했습니다.' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      payment: {
        orderId: data.orderId,
        orderName: data.orderName,
        totalAmount: data.totalAmount,
        method: data.method,
        approvedAt: data.approvedAt,
      },
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
