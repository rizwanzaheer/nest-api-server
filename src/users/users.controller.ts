import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dtos';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    console.log('createUser body is: ', body);
    this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    console.log('findOne id is: ', id);
    return this.usersService.findOne(parseInt(id));
  }
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  // @Post('signup')
  // update(@Body() body: CreateUserDto) {
  //   console.log('createUser body is: ', body);
  //   this.usersService.create(body.email, body.password);
  // }
  // @Post('signup')
  // remove(@Body() body: CreateUserDto) {
  //   console.log('createUser body is: ', body);
  //   this.usersService.create(body.email, body.password);
  // }
}
