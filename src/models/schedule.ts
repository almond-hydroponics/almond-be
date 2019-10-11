import * as mongoose from 'mongoose';
import { ISchedule } from '../interfaces/ISchedule'

const Schedule = new mongoose.Schema(
  {
    schedule: {
      type: String,
      required: [true, 'Kindly enter a time schedule'],
    },
    dateCreated: {
      type: Date,
      required: true,
      default: Date.now
    }
  }
);

export default mongoose.model<ISchedule & mongoose.Document>('Schedule', Schedule)
