import IHashProvider from '../models/IHashProvider';
import { hash, compare } from 'bcryptjs';

class BCryptHashProvider implements IHashProvider {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHashProvider;
