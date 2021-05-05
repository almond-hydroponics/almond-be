import mongoose from 'mongoose';
import validator from 'validator';
import { IUser } from '../interfaces/IUser';

const User = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Please enter your first name'],
			index: true,
		},
		lastName: {
			type: String,
			required: [true, 'Please enter your last name'],
			index: true,
		},
		email: {
			type: String,
			required: [true, 'Please enter email'],
			lowercase: true,
			unique: true,
			index: true,
			validate: (value) => validator.isEmail(value),
		},
		password: { type: String, select: false },
		salt: { type: String, select: false },
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
				'https://res.cloudinary.com/almondgreen/image/upload/v1608196073/Almond/avatar_lwhtoy.jpg',
		},
		isVerified: {
			type: Boolean,
			required: true,
			default: false,
		},
		verificationToken: { type: String, select: false },
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
