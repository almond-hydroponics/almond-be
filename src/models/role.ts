import * as mongoose from 'mongoose';
import { IRole } from '../interfaces/IRole';

const Role = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userCount: {
    type: Number,
    required: false,
    default: 0,
  },
  resourceAccessLevels: [{
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
    },
    permissions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permissions',
    }],
  }],
  deleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export default mongoose.model<IRole & mongoose.Document>('Role', Role);
