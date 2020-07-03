import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user_1 = await fakeUserRepository.create({
      name: 'User Test',
      email: 'userTest@example.com',
      password: '123456',
    });

    const user_2 = await fakeUserRepository.create({
      name: 'User Test 2',
      email: 'userTest2@example.com',
      password: '123456',
    });

    const authUser = await fakeUserRepository.create({
      name: 'User Test auth',
      email: 'userTestAuth@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: authUser.id,
    });

    expect(providers).toEqual([user_1, user_2]);
  });
});
