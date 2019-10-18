import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import { firebaseDatabase } from '../../firebase';

const route = Router();
const ref = firebaseDatabase.ref('/timeSchedule/schedules');

// ref.once('value', function(snapshot){
//   console.log(snapshot);
// });

export default (app: Router) => {
  app.use('/', route);

  /**
   * @route GET api/schedules
   * @description get all schedules route
   * @access Private
   */
  route.get('/schedules', async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling GetAllSchedules endpoint');
      try {
        let timeSchedules = [];
        let schedule = {};
        await ref.once('value', function (snapshot) {
          Object.keys(snapshot.val()).forEach(key => {
            schedule = {};
            schedule = snapshot.val()[key];
            // @ts-ignore
            schedule.id = key;
            timeSchedules.push(schedule)
          });
          if (timeSchedules.length > 0) {
          return res.status(200).send({
            success: true,
            message: 'Time schedules fetched successfully',
            data: timeSchedules,
          });
        }
        return res.status(404).send({
          success: false,
          message: 'You have not created any time schedules.'
        });
        })
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        return next(e)
      }
  })

  // Create a schedule

  // Get schedule by it's id

  // Update a schedule

  // Delete a schedule
}
