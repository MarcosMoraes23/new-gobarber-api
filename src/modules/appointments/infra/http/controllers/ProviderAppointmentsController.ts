import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.body;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentService,
    );

    const appointments = await listProviderAppointments.execute({
      provider_id,
      month,
      year,
      day,
    });

    return response.json(appointments);
  }
}
