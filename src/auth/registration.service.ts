import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { ConfirmationCode } from 'generated/prisma'

@Injectable()
export class RegistrationService {
  constructor(
    private auth: AuthService,
    private prisma: PrismaService
  ) {}

  async getIsCodeCorrect(email: string, code: number) {
    const codeInstance = await this.checkCode(email, code)

    return { correct: !!codeInstance }
  }

  async checkCode(email: string, code: number): Promise<ConfirmationCode | null> {
    const correctCode = await this.prisma.confirmationCode.findFirst({
      where: { code, email },
    })

    if (!correctCode) return null

    const codeLive = Date.now() - correctCode?.creationDate.getTime()

    if (codeLive >= 1000 * 60 * 10) {
      await this.prisma.confirmationCode.delete({
        where: { id: correctCode.id },
      })

      return null
    }

    return correctCode
  }

  async register(response: Response, email: string, username: string, password: string, code: number) {
    if (username.length < 3) return response.status(200).json({ ok: false, status: 'USERNAME_TOO_SHORT' })

    const emailExists = await this.prisma.user.findUnique({ where: { email } })
    if (emailExists) return response.status(200).json({ ok: false, status: 'EMAIL_EXISTS' })

    const usernameExists = await this.prisma.user.findUnique({
      where: { username },
    })
    if (usernameExists) return response.status(200).json({ ok: false, status: 'USERNAME_EXISTS' })

    const correctCode = await this.checkCode(email, code)
    if (!correctCode) return response.status(200).json({ ok: false, status: 'WRONG_CODE' })

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: bcrypt.hashSync(password, 10),
      },
    })
    await this.prisma.confirmationCode.delete({
      where: { id: correctCode.id },
    })

    this.auth.authorize(response, user.id)

    return response.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
    })
  }
}
