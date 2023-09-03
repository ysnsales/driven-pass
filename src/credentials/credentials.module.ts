import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { CredentialsRepository } from './credentials.repository';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';


@Module({
  providers: [CredentialsService, CredentialsRepository],
  controllers: [CredentialsController],
  imports: [UsersModule]
})
export class CredentialsModule {}
