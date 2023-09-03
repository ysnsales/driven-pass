import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {

  constructor(private readonly repository: UsersRepository) { }

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const user = await this.repository.getByEmail(email);
    if (user) throw new ConflictException("Email already in use.");

    return await this.repository.createUser(createUserDto);
  }

  async getUserById(id: number) {
    const user = await this.repository.getById(id);
    if (!user) throw new NotFoundException("User not found.");

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.repository.getByEmail(email);
  }

  async deleteUser(userId: number, password: string) {
    const user = await this.repository.getById(userId);
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) throw new UnauthorizedException("Invalid password");

    return await this.repository.deleteUser(userId);
  }  

}