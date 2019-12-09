import * as express from 'express';
import * as supertest from 'supertest';
import { Container } from 'typedi';
import agenda from '../../../loaders/agenda';
import AuthService from '../../../services/auth';
import * as mocked from '../__mocks__/index'
import expressLoader from '../../../loaders/express';


const app = express();
// const server = expressLoader({ app: app, agendaInstance: agenda<any> });
const request = supertest(app);
const authServerInstance = Container.get(AuthService);
const token = authServerInstance.generateToken(mocked.mockNewUser);
const url = '/schedules';

describe('Schedule API tests', () => {
  it('should add a new test successfully', (done) => {
    request
      .post(url)
      .set('Cookie', ['jwt-token=token'])
      .send(mocked.validScheduleData)
      .set('Accept', 'application/json')
      // .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Time schedule added successfully');
        done();
      })
  })
});
