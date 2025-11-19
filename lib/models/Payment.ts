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
};

