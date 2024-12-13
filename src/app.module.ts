import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesClientModule } from './modules/movies-client/movies-client.module';
import { HttpClientProvider } from './shared/http-client/http-client.provider';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import tmdbConfig from './config/tmdb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, tmdbConfig],
      isGlobal: true,
    }),
    MoviesClientModule,
  ],
  controllers: [AppController],
  providers: [AppService, HttpClientProvider],
  exports: [HttpClientProvider],
})
export class AppModule {}
