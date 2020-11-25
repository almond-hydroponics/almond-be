import * as mongoose from 'mongoose';
import { IResource } from '../interfaces/IResource';

export const Resource = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

export default mongoose.model<IResource & mongoose.Document>(
	'Resource',
	Resource,
);
