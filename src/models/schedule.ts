import * as mongoose from 'mongoose';
import {ISchedule} from '../interfaces/ISchedule'

const Schedule = new mongoose.Schema({
    schedule: {
      type: String,
      required: [true, 'Kindly enter a time schedule'],
    },
    dateCreated: {
      type: Date,
      required: true,
      default: Date.now
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
  }
);

export default mongoose.model<ISchedule & mongoose.Document>('Schedule', Schedule)
