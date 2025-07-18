import { Controller, Get, Post, Body, Param, Delete, Req, Query } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { Request } from 'express'

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    return this.postsService.create(createPostDto, request)
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.postsService.findAll(request)
  }

  @Get('get_by_author')
  findByAuthor(@Query('author') author: string) {
    return this.postsService.findByAuthor(author)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @Get('replies/:id')
  findReplies(@Param('id') id: string) {
    return this.postsService.findReplies(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id)
  }
}
