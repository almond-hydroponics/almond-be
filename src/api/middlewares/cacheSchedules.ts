import { NextFunction, Request, Response } from 'express';
import redisClient from '../../loaders/redis';

const cacheSchedules = async (req: Request, res: Response, next: NextFunction) => {
  const schedules = redisClient.getAsync('schedules');

  if (schedules !== null) {
    res.status(200).send({
      success: true,
      message: 'Time redis schedules fetched successfully',
      data: JSON.parse(await schedules),
    });
  }
  next();
};

export default cacheSchedules;
