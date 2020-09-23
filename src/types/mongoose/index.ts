// promise-bluebird.d.ts
import Bluebird from 'bluebird';

declare module 'mongoose' {
	type Promise<T> = Bluebird<T>;
}
