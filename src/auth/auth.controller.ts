import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto ) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll( @Request() req: Request) {
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ):LoginResponse {
    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }


}
