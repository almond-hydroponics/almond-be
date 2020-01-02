import { NextFunction, Request, Response } from 'express';
import { AppLogger } from '../../loaders/logger';
import redisClient from '../../loaders/redis';

const logger = new AppLogger('Schedule');

export const checkCacheSchedules = async (req: Request, res: Response, next: NextFunction) => {
  redisClient.get('schedules', (err, data) => {
    if (err) {
      // @ts-ignore
      logger.error('🔥 Redis error: ', err);
      res.status(500).send(err);
    }

    if (data != null) {
      res.status(200).send({
        success: true,
        message: 'Time redis schedules fetched successfully',
        data: JSON.parse(data),
      });
    } else {
      next();
    }
  });

  // if (schedules !== null) {
  //   res.status(200).send({
  //     success: true,
  //     message: 'Time redis schedules fetched successfully',
  //     data: JSON.parse(String(schedules)),
  //   });
  // }
};

// export const cachePumpSchedule = async (req: Request, res: Response, next: NextFunction) => {
//
// }
