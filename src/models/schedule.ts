import * as mongoose from 'mongoose';
import { ISchedule } from '../interfaces/ISchedule';

const Schedule = new mongoose.Schema({
    schedule: {
      type: String,
      required: [true, 'Kindly enter a time schedule'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    },
  },
  {timestamps: true}
);

export default mongoose.model<ISchedule & mongoose.Document>('Schedule', Schedule)
