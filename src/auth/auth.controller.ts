import { Controller, Post, Body, Res, Get, Query, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { RegisterDto } from './dto/RegisterDto'
import { RegistrationService } from './registration.service'
import { ProfileService } from './profile.service'

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private registration: RegistrationService,
    private profile: ProfileService
  ) {}

  @Post('login')
  login(@Res() response: Response, @Body() body: { login: string; password: string }) {
    return this.auth.login(response, body.login, body.password)
  }

  @Get('email')
  email(@Query('email') email: string) {
    return this.auth.checkEmail(email)
  }

  @Post('register')
  register(@Body() body: RegisterDto, @Res() response: Response) {
    console.log('request is here')
    return this.registration.register(response, body.email, body.username, body.password, body.confirmationCode)
  }

  @Get('code')
  code(@Query('email') email: string, @Query('code') code: string) {
    return this.registration.getIsCodeCorrect(email, +code)
  }

  @Get('profile')
  profileR(@Req() request: Request) {
    return this.profile.getProfile(request)
  }
}
