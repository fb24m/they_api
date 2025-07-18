import { IsString, Length } from 'class-validator'

export class CreatePostDto {
  @Length(1, 320)
  @IsString({})
  content: string

  replyTo?: number
}
