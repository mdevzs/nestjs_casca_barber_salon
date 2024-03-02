import { Test, TestingModule } from '@nestjs/testing';
import { BarberSalonController } from './barber-salon.controller';
import { BarberSalonService } from './barber-salon.service';

describe('BarberSalonController', () => {
  let controller: BarberSalonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarberSalonController],
      providers: [BarberSalonService],
    }).compile();

    controller = module.get<BarberSalonController>(BarberSalonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
