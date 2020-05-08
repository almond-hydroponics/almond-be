import { NextFunction, Request, Response } from 'express';
import redisClient from '../../loaders/redis';

const getCache = async (req: Request, res: Response, next: NextFunction) => {
  let key = req.route.path;
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

export default getCache;
