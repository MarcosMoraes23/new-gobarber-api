import { Router } from 'express';

import ensureAuthenticatied from '@modules/users/infra/http/middlewares/ensureAuthenticatied';
import ProvidersController from '../controllers/ProvidersController';

const providersRouter = Router();

const appointmentsController = new ProvidersController();

providersRouter.use(ensureAuthenticatied);

providersRouter.get('/', appointmentsController.index);

export default providersRouter;
