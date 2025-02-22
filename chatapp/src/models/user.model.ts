import {Document, Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
    _id: Schema.Types.String;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    verified: boolean;
    verificationLinkSent: boolean;
    avatarLink: string;
    toAuthJSON(): object;
}

const userSchema = new Schema<IUser>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        verificationLinkSent: { type: Boolean, default: false },
        avatarLink: { type: String },
    },
    { timestamps: true }
  );