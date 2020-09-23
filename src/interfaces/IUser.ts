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
	roles?: Role[] | string[];
	currentRole: string;
	devices?: [
		{
			_id: string;
			id: string;
			verified: string;
		},
	];
	activeDevice?: string;
}

export interface IUserInputDTO {
	name: string;
	email: string;
	password?: string;
	photo?: string;
	isVerified?: boolean;
	roles?: Role[] | string[];
}

interface Role {
	title?: string;
	_id?: string;
}
