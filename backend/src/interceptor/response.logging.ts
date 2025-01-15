import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const HTTP_SUCCESS_HANDLE_NAME = 'Success';

@Injectable()
export class ResponseLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTimestamp = Date.now();
    const handleName = context.getHandler().name;

    const url = context.getArgs()[0].url;
    this.logger.log(url, `${handleName}:Url`);

    const params = context.getArgs()[0].params;
    this.logger.log(JSON.stringify(params), `${handleName}:Params`);

    const body = context.getArgs()[0].body;
    this.logger.log(JSON.stringify(body), `${handleName}:Body`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${Date.now() - startTimestamp}ms`,
          HTTP_SUCCESS_HANDLE_NAME,
        );
      }),
    );
  }
}
