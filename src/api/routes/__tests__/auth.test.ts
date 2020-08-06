import request from 'supertest';
import http from 'http';
import User from '../../../models/user';
// import { userFactory } from '../../../utils/factory';

// const request = supertest(require('../../../app').default);

describe('Auth Test', () => {
  let server: http.Server;
  // server = require('../../../app').default;

  beforeAll(async (done) => {
    server = await require('../../../../src/app').default; //Exporting the server promise from app.ts

    done();
  });

  afterAll(async (done) => {
    server.close();
    await User.deleteMany({});

    done();
  });

  it('should return 201 if request is valid', async (done) => {
    const mockedLoggerInstance = {
      info() {}
    };

    // const userDTO = userFactory.build();
    const userDTO = {
      name: "Almond",
      email: "almond@test.com",
      password: "almondtest123",
    };
    const res = await request(server)
      .post('/auth/signup')
      .send(userDTO);

    expect(res.status).toEqual(201);

    // request(server)
    //   .post('/api/auth/signup')
    //   .send(userDTO)
    //   .end(async (err, res) => {
    //     if (err) return done(err);
    //     await res;
    //     expect(res.status).toEqual(201);
    //     done();
    //   })
    // expect(res.status).toBe(201);

    done();
  });
});
