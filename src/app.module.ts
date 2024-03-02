import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { CategoryModule } from './category/category.module';
import { DiscoverModule } from './discover/discover.module';
import { BarberSalonModule } from './barber-salon/barber-salon.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    HomeModule,
    CategoryModule,
    DiscoverModule,
    BarberSalonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
