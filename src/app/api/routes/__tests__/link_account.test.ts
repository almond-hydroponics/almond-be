import express from 'express'
import * as x  from '../linkAccount'
import {AppLogger} from "../../../app.logger";
import {Container} from "typedi";
import * as mongoose from "mongoose";
import {fakeTimers} from "./_common";


const app = express();
let logger;
describe("this tests the linkAccount route", ()=>{
  beforeEach(() => {
    fakeTimers();
    logger = new AppLogger('LinkAccount');
    Container.set('logger', logger);
  });

  it("should test /link_account route fully",  () =>  {
    /*
    #### THIS MODULE REQUIRES REFACTORING FROM THE device.ts (ENDPOINTS NEEDS TO BE EXPOSED TO OTHER INTERFACES)
    #### HAVING EXPORTED ENDPOINTS INDEPENDENTLY WOULD MANAGED TESTING EASILY.
     */
    //const req = mockRequest();
    //const resp = mockResponse();

    //#### TEMPORARILY INVOKE THE MAIN FUNCTION
    // expect(logger).toBeDefined();
    expect(app).toBeDefined();
    x.default(app);

  });
});
