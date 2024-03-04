import { Module } from '@nestjs/common';
import { BarberSalonService } from './barber-salon.service';
import { BarberSalonController } from './barber-salon.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServicesController } from './services/services.controller';
import { ServicesService } from './services/services.service';
import { PackagesController } from './packages/packages.controller';
import { PackagesService } from './packages/packages.service';

@Module({
  imports:[PrismaModule],
  controllers: [BarberSalonController, ServicesController, PackagesController],
  providers: [BarberSalonService, ServicesService, PackagesService],
})
export class BarberSalonModule {}
