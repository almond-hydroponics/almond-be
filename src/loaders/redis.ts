import * as redis from 'redis';
import config from '../config';
import Logger from './logger';
import * as bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(config.redisURL);

redisClient.on('connect', () => {
  Logger.info('✌️ Redis connected');
});

redisClient.on('error', err => {
  Logger.error('🔥 Redis error: ', err);
});

export default redisClient;
