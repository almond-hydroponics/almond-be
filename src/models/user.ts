import { IUser } from '../interfaces/IUser';
import * as mongoose from 'mongoose';

const User = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please enter your full name'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: String,
    salt: String,
    googleId: String,
    role: {
      type: String,
      default: 'user',
    },
    photo: {
      type: String,
      default: 'https://res.cloudinary.com/mashafrancis/image/upload/v1552641620/kari4me/nan.jpg',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    device: [
      {
        id: {
          type: String,
          required: true,
          unique: true,
        },
        verified: {
          type: Boolean,
          default: false,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ]
  },
  {timestamps: true},
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
