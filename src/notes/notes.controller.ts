import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('notes')
@ApiBearerAuth()
@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post()
    @ApiOperation({ summary: "Create a new note" })
    createNote(@Body() createNoteDto: CreateNoteDto, @User() user){
        const { id } = user;

        return this.notesService.createNote(createNoteDto, id);
    }

    @Get()
    @ApiOperation({ summary: "Get all notes from logged user" })
    getNotes(@User() user){
        console.log(user);
        const { id } = user;
        return this.notesService.getNotes(id);
    }

    @Get(':id')
    @ApiOperation({ summary: "Get a specific note" })
    getNotesByUserId(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.notesService.getNoteById(+id, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: "Delete a note" })
    deleteNote(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.notesService.deleteNote(+id, userId)
    }

}
