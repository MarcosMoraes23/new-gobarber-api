import { Router } from 'express';

import ensureAuthenticatied from '@modules/users/infra/http/middlewares/ensureAuthenticatied';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticatied);

appointmentsRouter.post('/', appointmentsController.create);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
