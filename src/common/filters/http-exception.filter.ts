import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error';

    const errorMessage = exception.message || 'Internal Server Error.';

    const meta_data: any = {
      httpRequest: {
        status,
        requestUrl: req.url,
        requestMethod: req.method,
        remoteIp: req.connection.remoteAddress,
      },
      data: {
        userId: req.user?.uid,
        body: req.body,
        stack_trace: exception.stack,
        ...(exception.response && exception.response.data && { httpResponse: exception.response.data }),
      },
    };

    this.logger.error(JSON.stringify(errorMessage), JSON.stringify(exception), JSON.stringify(meta_data));

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      error: message,
    });
  }
}
