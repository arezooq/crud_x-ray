import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { DataService } from './data.service';
import { DataEntity } from './entities/data.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

describe('DataService', () => {
  let service: DataService;
  let repository: Repository<DataEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: getRepositoryToken(DataEntity),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    repository = module.get<Repository<DataEntity>>(getRepositoryToken(DataEntity));
  });

  describe('createMany', () => {
    it('should insert multiple data correctly', async () => {
      const inputData = [
        [1, [51.339764, 12.339223833333334, 1.2038000000000002]],
      ];

      const result: DeepPartial<DataEntity> & DataEntity = {
        id: uuidv4(),
        time: new Date(),
        deviceId: 1,
        xCoordination: 51.339764,
        yCoordination: 12.339223833333334,
        speed: 1.2038,
      };

      // Mocking the save method to return the result
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      const actualResult = await service.createMany(inputData);

      // Adjusting the comparison by ensuring proper conversion of time
      expect(actualResult.map(item => ({
        ...item,
        time: item.time.toISOString(), // Convert time to ISO string for accurate comparison
      }))).toEqual([{
        ...result,
        time: result.time.toISOString(), // Ensure time is in ISO string format for comparison
      }]);
    });
  });
});
