import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const errorResponse = exception.getResponse();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const code: string =
      typeof errorResponse === 'object'
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ((errorResponse as any)?.code ?? undefined)
        : undefined;

    ctx.getResponse<Response>().status(status).json({
      statusCode: status,
      code,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
