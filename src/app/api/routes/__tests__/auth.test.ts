
import express from 'express'
import * as x  from '../auth'
import {AppLogger} from "../../../app.logger";
import {Container} from "typedi";
import mongoose from "mongoose";
import {fakeTimers} from "./_common";

const app = express();

const body = {
  firstName: 'name',
    lastName: 'name',
  email:'name@gmail.com',
  password:'Stoxx'
}
const mockRequest = () => {
  const req = {}
  // @ts-ignore
    req.body = jest.fn().mockReturnValue(body)
  return req
};

  const mockResponse =  () => {
  const res = {
    send: {},
    status: {},
    json: {"name":"name"}
  }
  res.send = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}
let logger;

describe('this tests the auth route', ()=>{
  beforeEach(() => {
    fakeTimers();
    logger = new AppLogger('Loaders');
    Container.set('logger', logger);
  });

  afterAll(() => {
    mongoose.connection.close()
  })
  it('test /auth route', async () =>  {
    /*
    #### THIS MODULE REQUIRES REFACTORING FROM THE auth.ts (ENDPOINTS NEEDS TO BE EXPOSED TO OTHER INTERFACES
    #### HAVING EXPORTED ENDPOINTS INDEPENDENTLY WOULD MANAGED TESTING EASILY.
     */
    const req = mockRequest();
    const resp = mockResponse();

    //#### TEMPORARILY INVOKE THE MAIN FUNCTION (TO CHANGE AFTER REFACTORING)
    expect(app).toBeDefined();
    expect(logger).toBeDefined();
    x.default(app);
  });
});
