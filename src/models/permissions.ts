import * as mongoose from 'mongoose';
import { IPermissions } from '../interfaces/IPermissions';

const Permissions = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
});

export default mongoose.model<IPermissions & mongoose.Document>(
	'Permissions',
	Permissions,
);
