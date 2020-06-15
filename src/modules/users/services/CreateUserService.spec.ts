import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUserService', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'User Test',
      email: 'userTest@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const UserEmail = 'userTest@example.com';

    await createUser.execute({
      name: 'User Test',
      email: UserEmail,
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'User Test',
        email: UserEmail,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
