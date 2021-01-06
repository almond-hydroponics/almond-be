import RedisCacheSingleton from './redisCache';
import LRUCacheSingleton from './lruCache';
import { config } from '../../config';

const cache = config.redisURL.startsWith('redis')
	? new RedisCacheSingleton()
	: new LRUCacheSingleton();

export default cache;
