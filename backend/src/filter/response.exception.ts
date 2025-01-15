import { HttpAdapterHost } from '@nestjs/core';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';

const ERROR_MESSAGE_DEFAULT = 'server error';
const HTTP_ERROR_HANDLE_NAME = 'Error';

const ErrorLogHandle = (exception: unknown, logger: Logger) => {
  if (exception instanceof HttpException) {
    logger.error(exception.name, exception.stack, HTTP_ERROR_HANDLE_NAME);
  } else if (exception instanceof Error) {
    logger.error(exception.message, exception.stack, HTTP_ERROR_HANDLE_NAME);
  } else {
    logger.error(exception, HTTP_ERROR_HANDLE_NAME);
  }
};

interface IResponseBody {
  code: number;
  message: string;
}

const ErrorResponseFormat = (exception: unknown): IResponseBody => {
  // 默认返回的错误信息，未捕获的异常
  const responseBody = {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: ERROR_MESSAGE_DEFAULT,
  };

  // 处理内部抛出的异常
  if (exception instanceof HttpException) {
    responseBody.code = exception.getStatus();
    responseBody.message = exception.message;
  }

  // 处理参数校验异常
  if (exception instanceof BadRequestException) {
    responseBody.code = exception.getStatus();
    const response = exception.getResponse() as { message: string };
    responseBody.message = response.message;
  }

  return responseBody;
};

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // 打印错误日志
    ErrorLogHandle(exception, this.logger);

    // 格式化response
    const responseBody = ErrorResponseFormat(exception);

    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.code);
  }
}
