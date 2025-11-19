import { ObjectId } from 'mongodb';
import { getDb } from '../db';

export interface User {
  _id?: ObjectId;
  name: string;
  phone: string;
  password: string; // hashed
  role: 'user' | 'admin';
  createdAt: Date;
}

export const UserModel = {
  collection: 'users',

  async create(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    const db = await getDb();
    const user: User = {
      ...userData,
      createdAt: new Date(),
    };
    const result = await db.collection<User>(this.collection).insertOne(user);
    return { ...user, _id: result.insertedId };
  },

  async findByPhone(phone: string): Promise<User | null> {
    const db = await getDb();
    return await db.collection<User>(this.collection).findOne({ phone });
  },

  async findById(id: string | ObjectId): Promise<User | null> {
    const db = await getDb();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await db.collection<User>(this.collection).findOne({ _id: objectId });
  },

  async findAll(): Promise<User[]> {
    const db = await getDb();
    return await db.collection<User>(this.collection).find({}).toArray();
  },

  async deleteById(id: string | ObjectId): Promise<boolean> {
    const db = await getDb();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await db.collection<User>(this.collection).deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  },
};

