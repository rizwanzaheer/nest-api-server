import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  Query,
  // UseInterceptors,
  // ClassSerializerInterceptor,
  NotFoundException,
  Session,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dtos';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

import { CurrentUser } from './decorators/current-user.decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/colors/:colors')
  // setColor(@Param('colors') colors: string, @Session() session: any) {
  //   session.colors = colors;
  //   console.log('session is: ', session);
  // }

  // @Get('/colors')
  // getColor(@Session() session: any) {
  //   console.log('session.color is: ', session.colors);
  //   return session.colors;
  // }
  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    console.log('createUser body is: ', body);
    // this.usersService.create(body.email, body.password);
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('findOne id is: ', id);
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    console.log('createUser body is: ', body);
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
