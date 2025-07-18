import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { User } from 'generated/prisma'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { random } from 'src/etc/random'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async validateUser(method: 'email' | 'username', login: string, password: string): Promise<Partial<User> | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        ...(method === 'email' ? { email: login } : { username: login }),
      },
      select: {
        username: true,
        id: true,
        email: true,
        avatarUrl: true,
        password: true,
      },
    })
    if (!user) return null
    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException()

    return user
  }

  getAuth(request: Request): number {
    if (!request.signedCookies['usedId']) throw new UnauthorizedException()

    const { userId }: { userId: number } = this.jwtService.verify(request.signedCookies['usedId'] as string)

    return userId
  }

  async checkEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      const code = random(100000, 999999)
      await fetch(`https://fb24m.ru/mail_the_y.php?email=${email}&code=${code}`)
      await this.prisma.confirmationCode.create({
        data: { email, code },
      })
    }

    return { exists: !!user }
  }

  async login(response: Response, login: string, password: string) {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const isEmail = reg.test(login.toLowerCase())

    const user = await this.validateUser(isEmail ? 'email' : 'username', login, password)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    this.authorize(response, user.id!)

    return response.status(200).json(user)
  }

  authorize(response: Response, userId: number) {
    response.cookie('usedId', this.jwtService.sign({ userId }), {
      httpOnly: true,
      sameSite: 'none',
      signed: true,
      secure: true,
    })
  }
}
