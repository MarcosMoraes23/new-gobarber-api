import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';
import { Segments, celebrate } from 'celebrate';
import Joi from '@hapi/joi';

const sessionsRouter = Router();

const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
