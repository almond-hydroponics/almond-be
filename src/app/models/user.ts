import * as mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const User = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your full name'],
			index: true,
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			index: true,
		},
		password: String,
		salt: String,
		googleId: String,
		roles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Role',
			},
		],
		currentRole: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Role',
		},
		photo: {
			type: String,
			default:
				'https://res.cloudinary.com/mashafrancis/image/upload/v1552641620/kari4me/nan.jpg',
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verificationToken: String,
		devices: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Device',
			},
		],
		activeDevice: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Device',
		},
	},
	{ timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
