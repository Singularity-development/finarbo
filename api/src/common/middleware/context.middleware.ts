import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { RequestContextService } from './request-context.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayload } from 'src/auth/auth.model';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private readonly contextService: RequestContextService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  use(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    const user = token
      ? this.jwtService.verify<AuthPayload>(token, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET')!,
        })
      : null;

    this.contextService.run(() => {
      this.contextService.set('user', user);
      next();
    }, {});
  }
}
