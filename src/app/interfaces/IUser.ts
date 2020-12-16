export interface IUser {
	_id: string;
	name: string;
	email: string;
	password?: string;
	salt?: string;
	photo?: string;
	isVerified?: boolean;
	googleId?: string;
	verificationToken?: string;
	roles?: Role[] | string[] | string;
	currentRole?: string;
	devices?: Device[];
	activeDevice?: string;
}

export interface IUserInputDTO {
	name: string;
	email: string;
	password?: string;
	photo?: string;
	isVerified?: boolean;
	roles?: Role[] | string[] | string;
	role?: string;
}

interface Role {
	title?: string;
	_id?: string;
}

interface Device {
	_id: string;
	id: string;
	verified: string;
}
