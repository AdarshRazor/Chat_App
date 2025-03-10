import mongoose, { Schema, Document } from 'mongoose';

// Define the Message interface (for TypeScript type safety)
interface IMessage extends Document {
  _id: string;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  message: string;
  createdAt?: Date; // Optional because mongoose adds these
  updatedAt?: Date; // Optional because mongoose adds these
}

// Define the Message schema
const MessageSchema: Schema = new Schema(
  {
    _id: {type: String},
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    recipient: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    createdAt: {type: Date, default: Date.now}
  },
  { timestamps: true }
);

// Create the Message model
const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message; // Or module.exports = Message; if you prefer CommonJS


