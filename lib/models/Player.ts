import { ObjectId } from 'mongodb';
import { getDb } from '../db';

export interface Player {
  _id?: ObjectId;
  userId: ObjectId;
  playerPhoto: string;
  playerName: string;
  contactNumber: string;
  dateOfBirth: Date;
  aadharNumber: string;
  village: string;
  postOffice: string;
  policeStation: string;
  city: string;
  gpSelection: string;
  parentName: string;
  parentContact: string;
  emergencyContactName: string;
  emergencyPhone: string;
  bowlingStyle: string[];
  battingStyle: string[];
  primaryRole: string;
  registrationDate: Date;
  paymentStatus: 'pending' | 'completed';
  paymentDate?: Date;
  transactionId?: string;
}

export const PlayerModel = {
  collection: 'players',

  async create(playerData: Omit<Player, '_id' | 'registrationDate' | 'paymentStatus'>): Promise<Player> {
    const db = await getDb();
    const player: Player = {
      ...playerData,
      userId: typeof playerData.userId === 'string' ? new ObjectId(playerData.userId) : playerData.userId,
      registrationDate: new Date(),
      paymentStatus: 'pending',
    };
    const result = await db.collection<Player>(this.collection).insertOne(player);
    return { ...player, _id: result.insertedId };
  },

  async findByUserId(userId: string | ObjectId): Promise<Player | null> {
    const db = await getDb();
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    return await db.collection<Player>(this.collection).findOne({ userId: objectId });
  },

  async findById(id: string | ObjectId): Promise<Player | null> {
    const db = await getDb();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await db.collection<Player>(this.collection).findOne({ _id: objectId });
  },

  async findAll(filter?: { paymentStatus?: 'pending' | 'completed' }): Promise<Player[]> {
    const db = await getDb();
    const query = filter?.paymentStatus ? { paymentStatus: filter.paymentStatus } : {};
    return await db.collection<Player>(this.collection)
      .find(query)
      .sort({ registrationDate: -1 })
      .toArray();
  },

  async updatePaymentStatus(
    id: string | ObjectId,
    paymentStatus: 'pending' | 'completed',
    paymentDate: Date,
    transactionId: string
  ): Promise<boolean> {
    const db = await getDb();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await db.collection<Player>(this.collection).updateOne(
      { _id: objectId },
      { $set: { paymentStatus, paymentDate, transactionId } }
    );
    return result.modifiedCount > 0;
  },

  async count(filter?: { paymentStatus?: 'pending' | 'completed' }): Promise<number> {
    const db = await getDb();
    const query = filter?.paymentStatus ? { paymentStatus: filter.paymentStatus } : {};
    return await db.collection<Player>(this.collection).countDocuments(query);
  },
};

