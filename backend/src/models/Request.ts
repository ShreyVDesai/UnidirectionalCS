import { Document, Schema, model, Types } from 'mongoose';

export interface IRequest extends Document {
  from: Types.ObjectId;
  acceptedBy?: Types.ObjectId | null;
  acceptedAt?: Date | null;
  responded: boolean;
  createdAt: Date;
}

const RequestSchema = new Schema<IRequest>({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  acceptedAt: { type: Date, default: null },
  responded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default model<IRequest>('Request', RequestSchema);
