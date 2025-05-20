import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestContextService } from './request-context.service';
import { AuthenticatedRequest } from 'src/auth/auth.model';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly contextService: RequestContextService) {}

  use(req: AuthenticatedRequest, _: Response, next: NextFunction) {
    this.contextService.run(() => {
      this.contextService.set('user', req.user);
      next();
    }, {});
  }
}
