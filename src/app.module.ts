import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesClientModule } from './modules/movies-client/movies-client.module';
import { HttpClientProvider } from './shared/http-client/http-client.provider';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import tmdbConfig from './config/tmdb.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSyncModule } from './modules/database-sync/database-sync.module';
import { MoviesModule } from './modules/movies/movies.module';
import AppDataSource from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, tmdbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    MoviesClientModule,
    DatabaseSyncModule,
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService, HttpClientProvider],
  exports: [HttpClientProvider],
})
export class AppModule {}
