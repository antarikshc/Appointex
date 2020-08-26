import { Router } from 'express';
import Controller from './event.controller';
import Validator from './event.validator';

const router = new Router();

router
  .route('/')
  .get(Validator.getEvents(), Controller.getEvents);

export default router;
