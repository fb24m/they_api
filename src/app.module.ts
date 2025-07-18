import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PostsModule } from './posts/posts.module'
import { PrismaService } from './prisma/prisma.service'
import { UsersModule } from './users/users.module'

@Module({
  imports: [AuthModule, PostsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
