import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
    })
  }
}
