import { Schema, model, Document, Types } from "mongoose";

export interface IRequest extends Document {
  requester: Types.ObjectId; // User A
  responders: Types.ObjectId[]; // Users B
  description: string;
  status: "pending" | "active" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "closed"],
      default: "pending",
    },
    responders: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

export default model<IRequest>("Request", RequestSchema);
