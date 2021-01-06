import { Secret, sign, verify } from 'jsonwebtoken';
import { DeepPartial } from '../../helpers/database';
import { config } from '../../../config';
import { IUser } from '../../interfaces/IUser';
import { IToken } from '../../interfaces/IToken';

export const createToken = (
	id: string | undefined,
	expiresIn: number,
	secret: Secret,
) =>
	sign({ id }, secret, {
		expiresIn,
		audience: config.session.domain,
		issuer: config.uuid,
	});

export const verifyToken = async (
	token: string,
	secret: string,
): Promise<IToken> =>
	new Promise((resolve, reject) => {
		verify(token, secret, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			resolve(decoded as IToken);
		});
	});

export const createAuthToken = ({ _id }: DeepPartial<IUser>): IToken => {
	const expiresIn = config.session.timeout;
	const accessToken = createToken(_id, expiresIn, config.session.secret);
	const refreshToken = createToken(
		_id,
		config.session.refresh.timeout,
		config.session.refresh.secret,
	);
	return {
		expiresIn,
		accessToken,
		refreshToken,
	};
};
