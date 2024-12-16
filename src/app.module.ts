import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesClientModule } from './modules/movies-client/movies-client.module';
import { HttpClientProvider } from './shared/http-client/http-client.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import tmdbConfig from './config/tmdb.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSyncModule } from './modules/database-sync/database-sync.module';
import { MoviesModule } from './modules/movies/movies.module';
import { UsersModule } from './modules/users/users.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import AppDataSource from './config/typeorm.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ThrottlerModule } from '@nestjs/throttler';
import throttlingConfig from './config/throttling.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, tmdbConfig, jwtConfig, redisConfig, throttlingConfig],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
          },
          password: configService.get<string>('redis.password'),
        });
        return {
          store: store as unknown as CacheStore,
          ttl: configService.get<number>('redis.ttl') * 60000,
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return [
          {
            ttl: configService.get<number>('throttling.ttl') * 60000,
            limit: configService.get<number>('throttling.limit'),
          },
        ];
      },
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    MoviesClientModule,
    DatabaseSyncModule,
    MoviesModule,
    UsersModule,
    WatchlistModule,
  ],
  controllers: [AppController],
  providers: [AppService, HttpClientProvider],
  exports: [HttpClientProvider, ThrottlerModule],
})
export class AppModule {}
