import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import auth from '@config/auth';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

export interface IRequest {
  email: string;
  password: string;
}

export interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    let passwordMatched = null;
    if (user) {
      passwordMatched = await this.hashProvider.compareHash(
        password,
        user.password,
      );
    }

    if (!user || !passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const token = sign({}, auth.secret, {
      subject: user.id,
      expiresIn: auth.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
