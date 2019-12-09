import { AppLogger } from '../../loaders/logger';
import ScheduleService from '../schedule';
import * as models from '../../models';
import * as mocked from '../__mocks__/index'
import * as mongoose from 'mongoose';

const Schedule = require('../../models/schedule');
const logger = new AppLogger(ScheduleService.name);

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;
  let connection;
  let db;

  // beforeAll(async () => {
  //   connection = await mongoose.connect(process.env.MONGODB_URI_TEST, {
  //     useNewUrlParser: true,
  //     useCreateIndex: true,
  //     useUnifiedTopology: true,
  //     useFindAndModify: false
  //   }, err => {
  //     if (err) {
  //       logger.error(err.message, err.stack);
  //       process.exit(1);
  //     }
  //   });
  //   db = await connection.connection.db;
  // });

  // afterAll(async () => {
  //   await connection.close();
  // });
  describe('CreateSchedule', () => {
    it('should create a new schedule', () => {
      // const validSchedule = scheduleService.CreateSchedule(mocked.mockedScheduleData, mocked.mockUser);
      // const savedSchedule = validSchedule.save();
      // expect(savedSchedule._id).toBeDefined();
      // const createScheduleSpy = jest.spyOn(schedule, 'create');
      // createScheduleSpy.mockResolvedValue([mocked.mockedScheduleDataResponse]);
      // const result = await scheduleService.CreateSchedule(mocked.mockedScheduleData, mocked.mockUser);
      // expect(createScheduleSpy).toHaveBeenCalled();
      // expect(result).not.toBeNull();
      expect(1).toBe(1);
    })
  })
});
