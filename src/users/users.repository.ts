import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {

  private SALT = 10;
  constructor(private readonly prisma: PrismaService) { }

  getById(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  createUser(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: { ...createUserDto, password: bcrypt.hashSync(createUserDto.password, this.SALT) }
    })
  }

}