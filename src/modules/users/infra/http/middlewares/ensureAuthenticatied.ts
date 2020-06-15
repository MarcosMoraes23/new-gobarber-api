import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import auth from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayloadDTO {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticatied(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, auth.secret);
    const { iat, sub, exp } = decoded as TokenPayloadDTO;
    request.user = {
      id: sub,
    };
    return next();
  } catch {
    throw new AppError('Invalid JWT', 401);
  }
}
