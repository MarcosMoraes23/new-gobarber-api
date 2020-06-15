import { Router } from 'express';

import ensureAuthenticatied from '@modules/users/infra/http/middlewares/ensureAuthenticatied';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticatied);

appointmentsRouter.post('/', appointmentsController.create);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);
// });

export default appointmentsRouter;
