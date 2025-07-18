import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { User } from 'generated/prisma'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService
  ) {}

  async getProfile(request: Request): Promise<User | { error: string }> {
    const id = this.auth.getAuth(request)

    const profile = await this.prisma.user.findUnique({
      where: { id },
    })

    return profile ?? { error: 'not authorized' }
  }
}
