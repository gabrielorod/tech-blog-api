import { Injectable } from '@nestjs/common';

// Adicione o decorator aqui:
@Injectable()
export abstract class HashingService {
  abstract hash(data: string): Promise<string>;
  abstract compare(data: string, encrypted: string): Promise<boolean>;
}
