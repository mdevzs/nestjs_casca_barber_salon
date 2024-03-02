import { Test, TestingModule } from '@nestjs/testing';
import { BarberSalonService } from './barber-salon.service';

describe('BarberSalonService', () => {
  let service: BarberSalonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarberSalonService],
    }).compile();

    service = module.get<BarberSalonService>(BarberSalonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
