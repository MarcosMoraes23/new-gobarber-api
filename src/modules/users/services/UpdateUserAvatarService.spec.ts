import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a user avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'User Test',
      email: 'userTest@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatarFileNameExample.png',
    });

    expect(user.avatar).toBe('avatarFileNameExample.png');
  });

  it('should not be able to update a user avatar to a non-existent user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'unexisting-user-id',
        avatarFilename: 'avatarFileNameExample.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete an old avatar while updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'User Test',
      email: 'userTest@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatarFileNameExample.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatarFileNameExample2.png',
    });

    expect(deleteFile).toHaveBeenCalled();
    expect(user.avatar).toBe('avatarFileNameExample2.png');
  });
});
