import { Document, Schema, model, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  type: 'A' | 'B';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['A', 'B'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IUser>('User', UserSchema);
