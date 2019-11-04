import * as mongoose from 'mongoose';
import { IScheduleOverride } from '../interfaces/IScheduleOverride'
import { uid } from '../utils/fancyGenerator';

const ScheduleOverride = new mongoose.Schema({
    enabled: {
      type: Boolean,
      default: false,
    },
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true,
    },
  }
);

export default mongoose.model<IScheduleOverride & mongoose.Document>('ScheduleOverride', ScheduleOverride)
