import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

/** Ensure proper access is available for the user object in an authenticated url */
export interface UserInAuth {
  user: {
    id: string;
  };
}

interface IUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface IUserMethods {
  matchPassword(password: string): boolean;
}

// Create type for user model
type UserModel = Model<IUser, {}, IUserMethods>;

const schema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

/** Method used to check if password is valid */
schema.method('matchPassword', async function matchPassword(password: string) {
  return await bcrypt.compare(password, this.password);
});

// This will be run when an update operation is being run
schema.pre('save', async function (next) {
  // Check if password has not been changed and skip process
  if (!this.isModified('password')) {
    next();
  }

  // We now know that password has been modified.
  // Generate salt for password
  const salt = await bcrypt.genSalt(10);

  // Hash the modified password and update the password field
  this.password = await bcrypt.hash(this.password, salt);
});

/** User Model. Use it to run CRUD on any user */
export const User = mongoose.model<IUser, UserModel>('User', schema);
