import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCardDto } from "./dto/create-card.dto";

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {} 

  createCard(createCardDto: CreateCardDto, userId: number){
    return this.prisma.card.create({
        data:{ ...createCardDto, userId}
    })
  }

  getCardsPerUser(title: string, userId: number) {
    return this.prisma.card.findFirst({
        where: {
            userId,
            title
        }
    })
  }

  getCards(userId: number) {
    return this.prisma.card.findMany({
        where: {userId}
    })
}

    getCardById(id: number) {
        return this.prisma.card.findFirst({
            where: {id}
        })
        
    }

    deleteCard(id: number, userId: number){
        return this.prisma.card.delete({
            where:{
                id,
                userId
            }
        })
    }
}