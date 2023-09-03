import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {constructor(private readonly CardsRepository: CardsRepository){}

async createCard(createCardDto: CreateCardDto, userId: number) {
    const checkCard = await this.CardsRepository.getCardsPerUser(createCardDto.title, userId);
    if (checkCard) throw new ConflictException("This title already exists!");

    return this.CardsRepository.createCard(createCardDto, userId);
}

async getCards(userId: number) {
    return this.CardsRepository.getCards(userId);
}

async getCardById(id: number, userId: number) {
    const Card = await this.CardsRepository.getCardById(id);

    if(!Card) throw new NotFoundException();
    if(Card.userId !== userId) throw new ForbiddenException();

    return Card;
}

async deleteCard(id: number, userId: number){
    const Card = await this.CardsRepository.getCardById(id);

    if(!Card) throw new NotFoundException();
    if(Card.userId !== userId) throw new ForbiddenException();

    return this.CardsRepository.deleteCard(id, userId);
}
}

