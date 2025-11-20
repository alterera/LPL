import { NextRequest, NextResponse } from 'next/server';
import { PaymentModel } from '@/lib/models/Payment';

const PAYMENT_GATEWAY_STATUS_API_URL = 'https://api.ekqr.in/api/check_order_status';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientTxnId = searchParams.get('client_txn_id');

    if (!clientTxnId) {
      // Redirect to dashboard with error
      const dashboardUrl = new URL('/dashboard', request.url);
      dashboardUrl.searchParams.set('payment', 'error');
      dashboardUrl.searchParams.set('message', 'Invalid payment transaction');
      return NextResponse.redirect(dashboardUrl);
    }

    // Find payment record
    const payment = await PaymentModel.findByClientTxnId(clientTxnId);
    if (!payment) {
      const dashboardUrl = new URL('/dashboard', request.url);
      dashboardUrl.searchParams.set('payment', 'error');
      dashboardUrl.searchParams.set('message', 'Payment record not found');
      return NextResponse.redirect(dashboardUrl);
    }

    // If payment already completed, redirect to dashboard
    if (payment.paymentStatus === 'completed') {
      const dashboardUrl = new URL('/dashboard', request.url);
      dashboardUrl.searchParams.set('payment', 'success');
      return NextResponse.redirect(dashboardUrl);
    }

    // Check payment status with gateway
    // Format date as DD-MM-YYYY
    const txnDate = new Date(payment.date);
    const formattedDate = `${String(txnDate.getDate()).padStart(2, '0')}-${String(txnDate.getMonth() + 1).padStart(2, '0')}-${txnDate.getFullYear()}`;

    const statusPayload = {
      key: process.env.PAYMENT_GATEWAY_KEY as string,
      client_txn_id: clientTxnId,
      txn_date: formattedDate,
    };

    try {
      const statusResponse = await fetch(PAYMENT_GATEWAY_STATUS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusPayload),
      });

      const statusData = await statusResponse.json();

      if (statusData.status && statusData.data) {
        const gatewayStatus = statusData.data.status;
        const dashboardUrl = new URL('/dashboard', request.url);

        if (gatewayStatus === 'success') {
          // Payment successful - webhook should have updated this, but check anyway
          dashboardUrl.searchParams.set('payment', 'success');
        } else {
          // Payment failed or pending
          dashboardUrl.searchParams.set('payment', gatewayStatus === 'failure' ? 'failed' : 'pending');
          if (statusData.data.remark) {
            dashboardUrl.searchParams.set('message', statusData.data.remark);
          }
        }

        return NextResponse.redirect(dashboardUrl);
      } else {
        // Status check failed or payment not found
        const dashboardUrl = new URL('/dashboard', request.url);
        dashboardUrl.searchParams.set('payment', 'pending');
        dashboardUrl.searchParams.set('message', statusData.msg || 'Payment status unknown');
        return NextResponse.redirect(dashboardUrl);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      // Redirect to dashboard with pending status
      const dashboardUrl = new URL('/dashboard', request.url);
      dashboardUrl.searchParams.set('payment', 'pending');
      dashboardUrl.searchParams.set('message', 'Unable to verify payment status. Please check your dashboard.');
      return NextResponse.redirect(dashboardUrl);
    }
  } catch (error) {
    console.error('Redirect handler error:', error);
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('payment', 'error');
    dashboardUrl.searchParams.set('message', 'An error occurred while processing payment');
    return NextResponse.redirect(dashboardUrl);
  }
}

