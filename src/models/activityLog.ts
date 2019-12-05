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
    dateCreated: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {timestamps: true}
);

export default mongoose.model<IActivityLog & mongoose.Document>('ActivityLog', ActivityLog)
