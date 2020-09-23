import redis from 'redis';
import { config } from '../config';
import bluebird from 'bluebird';
import { AppLogger } from './logger';

const logger = new AppLogger('Redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(config.redisURL);

redisClient.on('connect', () => {
	logger.log('✌️ Redis connected');
});

redisClient.on('error', (err) => {
	logger.error('🔥 Redis error: ', err);
});

export default redisClient;
