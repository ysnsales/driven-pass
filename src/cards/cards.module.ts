import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { UsersModule } from '../users/users.module';
import { CardsRepository } from './cards.repository';

@Module({
  providers: [CardsService, CardsRepository],
  controllers: [CardsController],
  imports: [UsersModule]
})
export class CardsModule {}
