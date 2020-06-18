import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailability';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from some provider', async () => {
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 6, 20, 8, 0, 0),
      provider_id: 'provider_id_test',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 20, 8, 0, 0),
      provider_id: 'provider_id_test',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 20, 10, 0, 0),
      provider_id: 'provider_id_test',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 21, 8, 0, 0),
      provider_id: 'provider_id_test',
    });

    const availability = listProviderMonthAvailability.execute({
      provider_id: 'provider_id_test',
      year: 2020,
      month: 6,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: false },
        { day: 22, available: true },
      ]),
    );
  });
});
