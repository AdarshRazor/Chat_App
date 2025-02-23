import mongoose, { Schema, Document, Model } from "mongoose";

interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const tokenSchema: Schema<IToken> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 3600000) },
});

const Token: Model<IToken> = mongoose.model<IToken>("token", tokenSchema);

export { Token, IToken };
