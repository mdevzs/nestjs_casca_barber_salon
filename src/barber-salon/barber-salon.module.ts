import { Module } from '@nestjs/common';
import { BarberSalonService } from './barber-salon.service';
import { BarberSalonController } from './barber-salon.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [BarberSalonController],
  providers: [BarberSalonService],
})
export class BarberSalonModule {}
