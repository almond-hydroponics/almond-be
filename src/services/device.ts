import { Container, Inject, Service } from 'typedi';
import { IDevice, IDeviceInputDTO } from '../interfaces/IDevice';
import { IUser } from '../interfaces/IUser';
import { AppLogger } from '../loaders/logger';

@Service()
export default class DeviceService {
  private logger = new AppLogger(DeviceService.name);
  constructor(
    @Inject('deviceModel') private deviceModel,
    @Inject('userModel') private userModel: Models.UserModel,
  ) {}

  public async AddDevice(deviceInputDTO: IDeviceInputDTO, user: IUser): Promise<{ device: IDevice }> {
    try {
      this.logger.debug('Adding a new device into database');
      const deviceItem = {
        ...deviceInputDTO,
      };
      const deviceRecord = await this.deviceModel.create(deviceItem);
      const device = deviceRecord.toObject();
      return { device: device }
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async UserAddDevice(deviceInputDTO: IDeviceInputDTO, user: IUser): Promise<{ device: IDevice }> {
    try {
      this.logger.debug('Adding a new device into database');
      const device = {
        ...deviceInputDTO,
        verified: true,
        user: {
          _id: user._id,
          name: user.name,
          photo: user.photo,
        }
      };
      const deviceExists = await this.GetDeviceById(deviceInputDTO.id);
      this.logger.debug(deviceExists);

      // if (!deviceExists) {
      //   throw new Error('Device ID does not exist. Kindly check again or contact maintenance team.')
      // }
      const userRecord: IUser = await this.userModel
        .findByIdAndUpdate(
          user._id,
          {
            $push: { device },
          },
          { new: true }
        )
        .populate({ path: 'device.user', select: '_id name photo' });

      if (!userRecord) {
        throw new Error('Could not add new device');
      }
      // @ts-ignore
      return { device: userRecord.device[userRecord.device.length - 1] };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetDeviceById(deviceId: string) {
    try {
      return await this.deviceModel.findOne({ id: { $eq: deviceId }})
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetDeviceByUser(userId: string) {
    try {
      return await this.deviceModel.findOne({ user: { $eq: userId }})
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async UpdateDevice(deviceInputDTO: IDeviceInputDTO, user: IUser): Promise<{ device: IDevice }> {
    try {
      this.logger.debug('Verifying device for the user');
      const deviceItem = {
        ...deviceInputDTO,
        user: user._id,
        verified: true,
      };

      return await this.deviceModel.findOneAndUpdate(
        {id: deviceItem.id }, deviceItem, { new: true })
        .populate({ path: 'user' });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

}

// const deviceRecord = await this.userModel.findOneAndUpdate(
//         { _id: user._id, 'device.id': deviceItem.id },
//         {
//           $set: {
//             'device.$.verified': deviceItem.verified
//           }
//         },
//         { new: true })
//         .populate({ path: 'device.user', select: '_id verified' });
//
//       if (!deviceRecord) {
//         throw new Error('Could not update device');
//       }
//       return deviceRecord;
