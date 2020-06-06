import {NextFunction, Request, Response} from 'express';
import redisClient from '../../loaders/redis';

// const getUrlFromRequest = (req: Request) => req.protocol + '://' + req.headers.host + req.originalUrl;

export const getCache = path => async (req: Request, res: Response, next: NextFunction) => {
  let key = `${req.currentUser._id}/${path}`;
  redisClient.get(key, (err, data) => {
    if (err) res.status(400).send(err);

    if (data !== null) {
      res.status(200).send({
        success: true,
        message: 'Data fetched successfully',
        data: JSON.parse(data),
      });
    }
    // if (data !== null) res.status(200).send(JSON.parse(data));
    else next();
  })
};

export const setCache = (path, data) => {
  const HASH_EXPIRATION_TIME = 60 * 60 * 24;
  return redisClient.set(path, JSON.stringify(data), 'EX', HASH_EXPIRATION_TIME);
}

export const clearCache = path => async (req: Request, res: Response, next: NextFunction) => {
  const key = `${req.currentUser._id}/${path}`;
  if (redisClient.keys(key)) redisClient.del(key);
  return next();
}

export const clearAllCache = async (req: Request, res: Response, next: NextFunction) => {
  redisClient.flushdb();
  next();
}
