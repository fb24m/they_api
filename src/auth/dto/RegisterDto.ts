import { IsAlphanumeric, IsEmail, IsNumber, IsStrongPassword } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsAlphanumeric('en-US')
  username: string

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  password: string

  @IsNumber()
  confirmationCode: number
}
