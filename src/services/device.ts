import { Inject, Service } from 'typedi';
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

  public async UserAddDevice(_id: string, user: IUser): Promise<{ device: IDevice }> {
    try {
      this.logger.debug('Verifying user device in database');
      const deviceExists = await this.GetDeviceById(_id);

      if (deviceExists) { throw new Error('Device already exists in your list. Kindly skip.'); }

      const userRecord: IUser = await this.userModel
        .findByIdAndUpdate(
          user._id,
          { $push: { devices: { $each: [_id] } }},
          { new: true })
        .populate({ path: 'devices' })
        .populate({ path: 'activeDevice' });

      const device = userRecord.devices[userRecord.devices.length - 1];

      this.UpdateCurrentDevice(device._id, user);

      if (!userRecord) {
        throw new Error('Could not add new device');
      }
      // @ts-ignore
      return { device: device };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetDeviceById(deviceId: string) {
    try {
      return await this.deviceModel
        .findOne({ id: { $eq: deviceId }})
        .populate({ path: 'user' })
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetDeviceByUser(userId: string) {
    try {
      return await this.deviceModel
        .findOne({ user: { $eq: userId }})
        .populate({ path: 'user' })
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetAllDevices() {
    try {
      return this.deviceModel
        .find()
        .populate({ path: 'user', select: 'name' })
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async UpdateCurrentDevice(id: string, user: IUser) {
    try {
      this.logger.debug('Updating current controlled device');
      const userRecord = await this.userModel
        .findByIdAndUpdate(
          user._id,
          { activeDevice: id },
          { new: true })
        .populate({ path: 'activeDevice' });
      const selectedDevice = userRecord.toObject().activeDevice;

      await this.deviceModel.updateMany({ user: selectedDevice.user }, { enabled: false });
      await this.deviceModel
        .findOneAndUpdate(
          { _id: selectedDevice._id },
          { enabled: true },
          { new: true }
        );
      return selectedDevice;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async DeleteDeviceById(deviceId) {
    try {
      return this.deviceModel.deleteOne({'_id': Object(deviceId)}).exec();
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async EditDevice(deviceId, deviceInputDTO: IDeviceInputDTO): Promise<{ device: IDevice }> {
    try {
      this.logger.silly('Editing device db record');
      const deviceItem = {
        ...deviceInputDTO,
        // _id: deviceId,
      };
      const deviceRecord = await this.deviceModel.findOneAndUpdate(
        { _id: deviceId },
        deviceItem,
        { new: true });
      const device = deviceRecord.toObject();
      return { device: device }
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
