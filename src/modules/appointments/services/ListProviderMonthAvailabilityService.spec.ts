import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

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
    for (let i = 8; i <= 17; i++) {
      await fakeAppointmentsRepository.create({
        date: new Date(2020, 5, 20, i, 0, 0),
        user_id: 'signed_user_id_test',
        provider_id: 'provider_id_test',
      });
    }

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider_id_test',
      year: 2020,
      month: 6,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
