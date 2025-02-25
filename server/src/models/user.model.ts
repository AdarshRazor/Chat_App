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
    refreshToken?: string;
    verificationLinkSent: boolean;
    avatarLink: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
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

// Password hashing middleware - This function executes before a user document is saved to the database.
userSchema.pre("save", async function (next) {
  // Only hash the password if it's been modified (or is new)
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare entered password with stored hash
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add the `toAuthJSON` method to the schema
userSchema.methods.toAuthJSON = function (): object {
    return {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

// Create and export the model
const User = model<IUser>("User", userSchema);
export default User;