import * as mongoose from 'mongoose';
import { IScheduleOverride } from '../interfaces/IScheduleOverride'
import {array} from "joi";

const ScheduleOverride = new mongoose.Schema({
    enabled: {
      type: Boolean,
      default: false,
    },
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    }
  }
);

export default mongoose.model<IScheduleOverride & mongoose.Document>('ScheduleOverride', ScheduleOverride)
