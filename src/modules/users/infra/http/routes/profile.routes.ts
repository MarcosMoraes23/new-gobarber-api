import { Router } from 'express';
import ensureAuthenticatied from '../middlewares/ensureAuthenticatied';
import ProfileController from '../controllers/ProfileController';
import { Segments, celebrate } from 'celebrate';
import Joi from '@hapi/joi';

const profileRouter = Router();

const profileController = new ProfileController();

profileRouter.use(ensureAuthenticatied);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

export default profileRouter;
