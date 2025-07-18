import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { RegistrationService } from './registration.service'
import { ProfileService } from './profile.service'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? '0256dccb077c345298328ba279a6649afc138ee1305537c51ba90c9139b23b3',
    }),
  ],
  providers: [AuthService, PrismaService, RegistrationService, ProfileService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
