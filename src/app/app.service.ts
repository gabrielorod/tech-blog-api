import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIsAlive(): string {
    return 'Is alive!';
  }
}
