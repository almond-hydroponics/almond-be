import * as mongoose from 'mongoose';
import {IActivityLog} from "../interfaces/IActivityLog";

const ActivityLog = new mongoose.Schema({
    actionType: {
      type: String
    },
    actionDesc: {
      type: String
    },
    action: {
      type: String
    },
    userId: {
      type: String,
    },
    stationIp: {
      type: String
    },
    stationOs: {
      type: String
    },
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true,
    },
    logType: {
      type: String
    },
  },
  {timestamps: true}
);

export default mongoose.model<IActivityLog & mongoose.Document>('ActivityLog', ActivityLog)
