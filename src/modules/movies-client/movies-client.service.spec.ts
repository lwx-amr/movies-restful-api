import { Test, TestingModule } from '@nestjs/testing';
import { MoviesClientService } from './movies-client.service';

describe('MoviesClientService', () => {
  let service: MoviesClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesClientService],
    }).compile();

    service = module.get<MoviesClientService>(MoviesClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
