import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = await fakeUserRepository.create({
      name: 'User Test',
      email: 'userTest@example.com',
      password: '123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = await jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      token,
      password: '123456',
    });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123456');
    expect(updatedUser?.password).toBe('123456');
  });

  it('should not be able to reset password to a non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'invalidFakeToken',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password to a non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );
    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if 2 hours passed', async () => {
    const user = await fakeUserRepository.create({
      name: 'User Test',
      email: 'userTest@example.com',
      password: '123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '123456',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
