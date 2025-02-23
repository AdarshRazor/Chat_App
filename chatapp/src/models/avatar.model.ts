import mongoose, { Schema, Document, Model } from "mongoose";

interface IAvatar extends Document {
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AvatarSchema: Schema<IAvatar> = new Schema(
  {
    link: {
      type: String,
      required: true,
      default: "https://i.imgur.com/qGsYvAK.png",
    },
  },
  { timestamps: true }
);

const Avatar: Model<IAvatar> = mongoose.model<IAvatar>("Avatar", AvatarSchema);

export { Avatar, IAvatar };
