import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseSyncController } from './database-sync.controller';
import { DatabaseSyncService } from './database-sync.service';
import { ThrottlerModule } from '@nestjs/throttler';

describe('DatabaseSyncController', () => {
  let controller: DatabaseSyncController;
  let databaseSyncService: jest.Mocked<DatabaseSyncService>;

  beforeEach(async () => {
    const mockDatabaseSyncService = {
      syncGenres: jest.fn(),
      syncMovies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 60,
            limit: 10,
          },
        ]),
      ],
      controllers: [DatabaseSyncController],
      providers: [
        {
          provide: DatabaseSyncService,
          useValue: mockDatabaseSyncService,
        },
      ],
    }).compile();

    controller = module.get<DatabaseSyncController>(DatabaseSyncController);
    databaseSyncService = module.get(DatabaseSyncService);
  });

  describe('syncGenres', () => {
    it('should call syncGenres service method and return success message', async () => {
      databaseSyncService.syncGenres.mockResolvedValue(undefined);

      const result = await controller.syncGenres();

      expect(databaseSyncService.syncGenres).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Genres synced successfully' });
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Sync failed');
      databaseSyncService.syncGenres.mockRejectedValue(error);

      await expect(controller.syncGenres()).rejects.toThrow(error);
    });
  });

  describe('syncMovies', () => {
    it('should call syncMovies service method and return success message', async () => {
      databaseSyncService.syncMovies.mockResolvedValue(undefined);

      const result = await controller.syncMovies();

      expect(databaseSyncService.syncMovies).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Movies synced successfully' });
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Sync failed');
      databaseSyncService.syncMovies.mockRejectedValue(error);

      await expect(controller.syncMovies()).rejects.toThrow(error);
    });
  });
});
