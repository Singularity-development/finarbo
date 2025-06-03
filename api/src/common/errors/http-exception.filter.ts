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
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = exception.getResponse();

    let message = exception.message;
    let code: string | undefined;

    if (typeof errorResponse === 'object' && errorResponse !== null) {
      const resObj = errorResponse as Record<string, any>;

      code = typeof resObj.code === 'string' ? resObj.code : undefined;

      // Use the 'message' array (e.g. from ValidationPipe)
      if (Array.isArray(resObj.message)) {
        message = resObj.message.join(', ');
      } else if (typeof resObj.message === 'string') {
        message = resObj.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
