import { ConflictException, Injectable } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
    constructor(private readonly notesRepository: NotesRepository){}

    async createNote(createNoteDto: CreateNoteDto, userId: number) {
        const checkCredential = await this.notesRepository.getNotesPerUser(createNoteDto.title, userId);
        if (checkCredential) throw new ConflictException("This title already exists!");

        return this.notesRepository.createNote(createNoteDto, userId);
    }
}
