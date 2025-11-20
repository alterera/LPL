import { ObjectId } from 'mongodb';
import { getDb } from '../db';

export interface Payment {
  _id?: ObjectId;
  playerId: ObjectId;
  playerName: string;
  amount: number;
  date: Date;
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId: string;
  // Payment gateway fields
  orderId?: number; // ekqr.in order_id
  clientTxnId: string; // Unique transaction ID for tracking
  paymentUrl?: string; // Payment gateway URL
  upiTxnId?: string; // UPI transaction ID from gateway
  customerEmail?: string;
  customerMobile?: string;
}

export const PaymentModel = {
  collection: 'payments',

  async create(paymentData: Omit<Payment, '_id' | 'date'>): Promise<Payment> {
    const db = await getDb();
    const payment: Payment = {
      ...paymentData,
      playerId: typeof paymentData.playerId === 'string' ? new ObjectId(paymentData.playerId) : paymentData.playerId,
      date: new Date(),
    };
    const result = await db.collection<Payment>(this.collection).insertOne(payment);
    return { ...payment, _id: result.insertedId };
  },

  async findAll(): Promise<Payment[]> {
    const db = await getDb();
    return await db.collection<Payment>(this.collection)
      .find({})
      .sort({ date: -1 })
      .toArray();
  },

  async findByPlayerId(playerId: string | ObjectId): Promise<Payment[]> {
    const db = await getDb();
    const objectId = typeof playerId === 'string' ? new ObjectId(playerId) : playerId;
    return await db.collection<Payment>(this.collection)
      .find({ playerId: objectId })
      .sort({ date: -1 })
      .toArray();
  },

  async getTotalAmount(): Promise<number> {
    const db = await getDb();
    const result = await db.collection<Payment>(this.collection).aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const data = await result.toArray();
    return data[0]?.total || 0;
  },

  async findByClientTxnId(clientTxnId: string): Promise<Payment | null> {
    const db = await getDb();
    return await db.collection<Payment>(this.collection).findOne({ clientTxnId });
  },

  async updatePaymentStatus(
    id: string | ObjectId,
    paymentStatus: 'pending' | 'completed' | 'failed',
    upiTxnId?: string,
    transactionId?: string
  ): Promise<boolean> {
    const db = await getDb();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const updateData: any = { paymentStatus };
    if (upiTxnId) updateData.upiTxnId = upiTxnId;
    if (transactionId) updateData.transactionId = transactionId;
    
    const result = await db.collection<Payment>(this.collection).updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  },
};

