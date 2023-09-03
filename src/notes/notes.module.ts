import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
  imports: [UsersModule]
})
export class NotesModule {}
