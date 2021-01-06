import redis, { RedisClient } from 'redis';
import { promisify } from 'util';
import { config } from '../../config';
import { convertMinutesToSeconds } from '../utils';

type Key = string | number;

class RedisCacheSingleton {
	private static exists: RedisCacheSingleton;
	private static instance: RedisCacheSingleton;
	private client;
	constructor() {
		if (RedisCacheSingleton.exists) {
			return RedisCacheSingleton.instance;
		}

		this.client = redis.createClient(config.redisURL);
		this.client.getAsync = promisify(this.client.get);
		this.client.setAsync = promisify(this.client.set);
		this.client.setexAsync = promisify(this.client.setex);
		this.client.delAsync = promisify(this.client.del);
		this.client.flushallAsync = promisify(this.client.flushall);

		RedisCacheSingleton.instance = this;
		RedisCacheSingleton.exists = this;
	}

	async save<T>(key: Key, field: string, value: string): Promise<T> {
		const currentState = await this.fetch(key);
		if (!currentState) {
			return this.saveObject(key, { [field]: value });
		}
		currentState[field] = value;
		return this.client.setAsync(key, JSON.stringify(currentState));
	}

	async fetch<T>(key: Key): Promise<T> {
		const result = await this.client.getAsync(key);
		return result ? JSON.parse(result) : result;
	}

	async saveObject<T>(
		key: Key,
		value: { [p: string]: string },
	): Promise<T | undefined> {
		const maxCacheAge = convertMinutesToSeconds(5);
		return this.client.setexAsync(key, maxCacheAge, JSON.stringify(value));
	}

	async delete(key: Key): Promise<void> {
		return this.client.delAsync(key);
	}

	async flush(): Promise<void> {
		return this.client.flushallAsync();
	}
}

export default RedisCacheSingleton;
