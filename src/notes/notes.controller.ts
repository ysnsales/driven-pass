import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post()
    createNote(@Body() createNoteDto: CreateNoteDto, @User() user){
        const { id } = user;

        return this.notesService.createNote(createNoteDto, id);
    }

    @Get()
    getNotes(@User() user){
        console.log(user);
        const { id } = user;
        return this.notesService.getNotes(id);
    }

    @Get(':id')
    getNotesByUserId(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.notesService.getNoteById(+id, userId);
    }

    @Delete(':id')
    deleteNote(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.notesService.deleteNote(+id, userId)
    }

}
