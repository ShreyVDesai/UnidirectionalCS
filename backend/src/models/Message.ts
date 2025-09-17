import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  requestId: Types.ObjectId;   // Link to Request
  sender: Types.ObjectId;      // User ID (A or B)
  senderType: "A" | "B";       // Who sent the message
  content: string;
  expiresAt?: Date;            // Only for A’s messages
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,   // store actual User ID
      ref: "User",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["A", "B"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      index: { expires: 0 }, // TTL → auto delete after expiresAt
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const MessageModel = model<IMessage>("Message", messageSchema);
