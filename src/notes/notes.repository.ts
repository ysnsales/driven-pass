import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {} 

  createNote(createNoteDto: CreateNoteDto, userId: number){
    return this.prisma.note.create({
        data:{ ...createNoteDto, userId}
    })
  }

  getNotesPerUser(title: string, userId: number) {
    return this.prisma.note.findFirst({
        where: {
            userId,
            title
        }
    })
  }

  getNotes(userId: number) {
    return this.prisma.note.findMany({
        where: {userId}
    })
}

    getNoteById(id: number) {
        return this.prisma.note.findFirst({
            where: {id}
        })
        
    }

    deleteNote(id: number, userId: number){
        return this.prisma.note.delete({
            where:{
                id,
                userId
            }
        })
    }
}
