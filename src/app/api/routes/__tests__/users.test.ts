import express from 'express'
import * as x  from '../user'
import {AppLogger} from "../../../app.logger";
import {Container} from "typedi";

const app = express();

describe("this tests the users route", ()=>{
  beforeEach(() => {
    jest.useFakeTimers();
    const logger = new AppLogger('Loaders');
    Container.set('logger', logger);
  });

  it("should executes /user route", async () =>  {
    /*
    #### THIS MODULE REQUIRES REFACTORING FROM THE device.ts (ENDPOINTS NEEDS TO BE EXPOSED TO OTHER INTERFACES)
    #### HAVING EXPORTED ENDPOINTS INDEPENDENTLY WOULD MANAGED TESTING EASILY.
     */
    //const req = mockRequest();
    //const resp = mockResponse();

    //#### TEMPORARILY INVOKE THE MAIN FUNCTION
    expect(app).toBeDefined();
    x.default(app);
  });
});
