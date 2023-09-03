import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post()
    createCredential(@Body() createNoteDto: CreateNoteDto, @User() user){
        const { id } = user;

        return this.notesService.createNote(createNoteDto, id);
    }

}
