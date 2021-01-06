import LRUCache from 'lru-cache';
import { convertMinutesToSeconds } from '../utils';

type Key = string | number;

const cacheOptions = (maxAgeInMinutes: number) => ({
	maxAge: convertMinutesToSeconds(maxAgeInMinutes),
});

class LRUCacheSingleton {
	private cache;
	private static exists: LRUCacheSingleton;
	private static instance: LRUCacheSingleton;

	constructor(maxAgeInMinutes = 5) {
		if (LRUCacheSingleton.exists) {
			return LRUCacheSingleton.instance;
		}
		this.cache = new LRUCache(cacheOptions(maxAgeInMinutes));
		LRUCacheSingleton.instance = this;
		LRUCacheSingleton.exists = this;
	}

	getAsync<T>(key: Key): Promise<T | undefined> {
		return new Promise((resolve, reject) => {
			try {
				const result = this.cache.get(key);
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	async fetch<T>(key: Key): Promise<T | undefined> {
		return this.getAsync(key);
	}

	async saveObject<T>(
		key: Key,
		value: { [p: string]: string },
	): Promise<T | undefined> {
		const maxCacheAge = convertMinutesToSeconds(5);
		return new Promise((resolve, reject) => {
			try {
				const data = this.cache.set(key, value, maxCacheAge);
				resolve(data);
			} catch (error) {
				reject(error);
			}
		});
	}

	async save<T>(key: Key, field: string, value: string): Promise<T> {
		const currentState = await this.fetch(key);
		if (!currentState) {
			return this.saveObject(key, { [field]: value });
		}
		currentState[field] = value;
		return this.cache.set(key, currentState);
	}

	async delete(key: Key): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			try {
				this.cache.del(key);
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	async flush(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			try {
				this.cache.reset();
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
}

export default LRUCacheSingleton;
