import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = this.generateCacheKey(request);

    const cachedResponse = await this.cacheManager.get(key);
    if (cachedResponse) {
      console.log('Cache hit');
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap(async (response) => {
        console.log('Cache miss');
        await this.cacheManager.set(key, response, this.configService.get<number>('redis.ttl') * 6000);
      }),
    );
  }

  private generateCacheKey(request: any): string {
    const { method, originalUrl, query, params } = request;
    return `${method}:${originalUrl}:${JSON.stringify(query)}:${JSON.stringify(params)}`;
  }
}
