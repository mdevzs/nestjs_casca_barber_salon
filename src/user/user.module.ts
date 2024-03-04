import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JSON_TOKEN_KEY,
      signOptions: { expiresIn: "30d" }
    })
  ],
  controllers: [AuthController, ProfileController],
  providers: [
    AuthService, {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }, ProfileService,
  ]
})
export class UserModule { }
