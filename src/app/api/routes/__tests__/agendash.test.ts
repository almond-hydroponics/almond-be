import express from 'express';
import basicAuth from 'express-basic-auth';
import { Container } from 'typedi';
import { config } from '../../../../config';
import mongooseLoader from "../../../loaders/mongoose";
import agendaFactory from "../../../loaders/agenda";
import * as x from '../agendash'
import {fakeTimers} from "./_common";

fakeTimers();
const app = express();
let  mongoConnection;
let  agendaInstance;
describe('this should test agendash /dash route', () => {
	beforeEach(async () => {

    /*
    # Refactor mongo service on this test which will enable smooth mocking of the mongo connection
    */

    fakeTimers();
    // basicAuth({
    //   users: {
    //     [config.agendash.user]: config.agendash.password,
    //   },
    //   challenge: true,
    // });

    /*
    ### REFACTOR MONGO CONNECTION SERVICE TO BE TESTABLE WITH THIS
     */

  //   fakeTimers();
  //   mongoConnection = await mongooseLoader().then(() => {

  //   });
  //   fakeTimers();
  //   jest.enableAutomock();
  //   jest.autoMockOn();
  //   agendaInstance = agendaFactory({ mongoConnection });
  //   Container.set('agendaInstance',agendaInstance);
  })


	it('should expect to load the /dash route',  () => {
    /*
    ### REFACTOR MONGO CONNECTION SERVICE TO BE LOADED BEFORE THIS IS EXECUTED
     */
    //#### TEMPORARILY INVOKE THE MAIN FUNCTION

    // expect(app).toBeDefined();
    // x.default(app);
    console.log(`/*
    # Refactor mongo service on this test which will enable smooth mocking of the mongo connection
    */`)
	});
});
