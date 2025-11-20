import { NextRequest, NextResponse } from 'next/server';
import { PaymentModel } from '@/lib/models/Payment';
import { PlayerModel } from '@/lib/models/Player';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    // Parse form data from webhook
    const formData = await request.formData();
    
    // Extract payment gateway data
    const amount = formData.get('amount');
    const clientTxnId = formData.get('client_txn_id') as string;
    const status = formData.get('status') as string;
    const upiTxnId = formData.get('upi_txn_id') as string | null;
    const orderId = formData.get('id') as string | null;
    const remark = formData.get('remark') as string | null;
    const udf1 = formData.get('udf1') as string | null; // Player ID
    const udf2 = formData.get('udf2') as string | null; // User ID
    const udf3 = formData.get('udf3') as string | null; // Payment type

    if (!clientTxnId) {
      console.error('Webhook error: Missing client_txn_id');
      return NextResponse.json(
        { error: 'Missing client_txn_id' },
        { status: 400 }
      );
    }

    // Find payment record
    const payment = await PaymentModel.findByClientTxnId(clientTxnId);
    if (!payment) {
      console.error(`Webhook error: Payment not found for client_txn_id: ${clientTxnId}`);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const paymentStatus = status === 'success' ? 'completed' : 'failed';
    const transactionId = upiTxnId || payment.transactionId || clientTxnId;

    await PaymentModel.updatePaymentStatus(
      payment._id!,
      paymentStatus,
      upiTxnId || undefined,
      transactionId
    );

    // If payment successful, update player payment status
    if (paymentStatus === 'completed' && udf1) {
      const paymentDate = new Date();
      await PlayerModel.updatePaymentStatus(
        udf1,
        'completed',
        paymentDate,
        transactionId
      );
    }

    // Log webhook data for debugging
    console.log('Webhook received:', {
      clientTxnId,
      status,
      upiTxnId,
      orderId,
      paymentStatus,
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

