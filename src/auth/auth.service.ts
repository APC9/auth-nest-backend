import { BadRequestException, Request, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto, LoginUserDto, RegisterUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload, LoginResponse } from './interfaces';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectModel( User.name )
    private userModel: Model<User>,

    private readonly jwtService: JwtService,
  ){}


  async create(createUserDto: CreateUserDto):Promise<User>{

    try {
      const { password, ...userData} = createUserDto;

      const user = new this.userModel({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      })

      await user.save();
      const { password:_, ...newUser } = user.toJSON();

      return newUser;

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async register(registerUserDto: RegisterUserDto):Promise<LoginResponse>{
    
    const user = await this.create( registerUserDto );

    return {
      user,
      token: this.getJwtToken({id: user._id })
    }
  }

  async login(loginUserDto: LoginUserDto):Promise<LoginResponse>{

    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email })

    if (!user ){
      throw new UnauthorizedException('Invalid user credentials');
    }

    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    const { password:_, ...rest  } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }

  }

  findAll():Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string):Promise<User> {
    const user = await this.userModel.findById(id);
    const { password, ...rest} = user.toJSON();
    return rest;
  }


  getJwtToken(payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error:any):never {
    //error en consola con el formato de Nestjs
    if ( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpeced error, check server logs');
  }
}
