import { Module } from '@nestjs/common';
import { RequestContextService } from './request-context.service';
import { ContextMiddleware } from './context.middleware';

@Module({
  providers: [RequestContextService, ContextMiddleware],
  exports: [RequestContextService],
})
export class ContextModule {}
