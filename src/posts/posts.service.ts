import { Injectable } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { Post } from 'generated/prisma'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthService } from 'src/auth/auth.service'
import { Request } from 'express'

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService
  ) {}

  create(createPostDto: CreatePostDto, request: Request): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: this.auth.getAuth(request),
      },
    })
  }

  findAll(request: Request) {
    return this.prisma.post.findMany({
      where: { authorId: this.auth.getAuth(request) },
    })
  }

  async findByAuthor(author: string) {
    return (
      await this.prisma.post.findMany({
        where: {
          author: {
            username: author,
          },
        },
      })
    ).toReversed()
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    })
  }

  remove(id: number) {
    return `This action removes a #${id} post`
  }

  findReplies(id: number) {
    return this.prisma.post.findMany({
      where: {
        replyTo: id,
      },
    })
  }
}
