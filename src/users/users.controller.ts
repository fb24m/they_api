import { Controller, Get, Param } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return this.usersService.findUnique(+id)
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username)
  }
}
