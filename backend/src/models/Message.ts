import { Document, Schema, model, Types } from 'mongoose';

export interface IMessage extends Document {
  requestId: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  requestId: { type: Schema.Types.ObjectId, ref: 'Request', required: true },
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IMessage>('Message', MessageSchema);
