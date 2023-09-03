import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
    constructor(private readonly notesRepository: NotesRepository){}

    async createNote(createNoteDto: CreateNoteDto, userId: number) {
        const checkNote = await this.notesRepository.getNotesPerUser(createNoteDto.title, userId);
        if (checkNote) throw new ConflictException("This title already exists!");

        return this.notesRepository.createNote(createNoteDto, userId);
    }

    async getNotes(userId: number) {
        return this.notesRepository.getNotes(userId);
    }

    async getNoteById(id: number, userId: number) {
        const note = await this.notesRepository.getNoteById(id);

        if(!note) throw new NotFoundException();
        if(note.userId !== userId) throw new ForbiddenException();

        return note;
    }

    async deleteNote(id: number, userId: number){
        const Note = await this.notesRepository.getNoteById(id);

        if(!Note) throw new NotFoundException();
        if(Note.userId !== userId) throw new ForbiddenException();

        return this.notesRepository.deleteNote(id, userId);
    }
}
