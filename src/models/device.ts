import * as mongoose from 'mongoose';
import { IDevice } from '../interfaces/IDevice';

const Device = new mongoose.Schema({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }
);

export default mongoose.model<IDevice & mongoose.Document>('Device', Device);
