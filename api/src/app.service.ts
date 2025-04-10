import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getEnv() {
    if (process.env.NODE_ENV === 'production') {
      return 'Running in production mode';
    }
    return 'Running in development mode';
  }
}
