import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  sendStatus(response: Response, status: number, json: object) {
    response.status(status).json(json);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseBody = exception.getResponse();

    switch (status) {
      case 429:
      case 404:
        response.sendStatus(404);

        break;

      case 403:
        response.status(403).json({
          fields: ['id'],
          message: 'Доступ не предоставлен.',
        });
        return;

      case 401:
        response.status(401).json({
          field: ['accessToken', 'refreshToken'],
          message: 'Вы не авторизованы',
        });

        break;

      case 400:
        if (typeof responseBody === 'object') {
          response.status(status).json(responseBody);
        } else {
          this.sendStatus(response, status, { message: responseBody });
        }

        break;

      default:
        this.sendStatus(response, status, {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}
