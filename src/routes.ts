import { verifyGatewayRequest } from '@irshadkhan2019/job-app-shared';
import { Application } from 'express';


const BASE_PATH = '/api/v1/order';

const appRoutes = (app: Application): void => {
  app.use('', ()=>console.log("h"));
  app.use(BASE_PATH, verifyGatewayRequest, ()=>console.log("ss"));
};

export { appRoutes };