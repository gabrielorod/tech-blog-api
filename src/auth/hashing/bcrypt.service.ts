import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
