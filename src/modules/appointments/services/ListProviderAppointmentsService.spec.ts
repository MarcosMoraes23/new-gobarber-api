import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentService from './ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointment: ListProviderAppointmentService;

describe('ListProviderAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointment = new ListProviderAppointmentService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 20, 8, 0, 0),
      user_id: 'signed_user_id_test',
      provider_id: 'provider_id_test',
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 20, 15, 0, 0),
      user_id: 'signed_user_id_test',
      provider_id: 'provider_id_test',
    });

    const availability = await listProviderAppointment.execute({
      provider_id: 'provider_id_test',
      year: 2020,
      month: 6,
      day: 20,
    });

    expect(availability).toEqual([appointment1, appointment2]);
  });
});
