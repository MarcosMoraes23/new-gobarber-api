import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'User Test',
      email: 'userTest@example.com',
      password: '123123',
    });

    await sendForgotPasswordEmail.execute({
      email: 'userTest@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a password from a non-existing user/email', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'userTest@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'User Test',
      email: 'userTest@example.com',
      password: '123123',
    });

    await sendForgotPasswordEmail.execute({
      email: 'userTest@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
