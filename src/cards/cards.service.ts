import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {
    private secret = process.env.CRYPTR_SECRET;
    private Cryptr = require('cryptr');
    private cryptr = new this.Cryptr(this.secret);
    constructor(private readonly CardsRepository: CardsRepository){}

async createCard(createCardDto: CreateCardDto, userId: number) {
    const checkCard = await this.CardsRepository.getCardsPerUser(createCardDto.title, userId);
    if (checkCard) throw new ConflictException("This title already exists!");

    return this.CardsRepository.createCard(createCardDto, userId);
}

async getCards(userId: number) {
    const cards = await this.CardsRepository.getCards(userId);
    return cards.map((card) => {
        return { ...card, password: this.cryptr.decrypt(card.password), cvv: this.cryptr.decrypt(card.cvv)};
      });
}

async getCardById(id: number, userId: number) {
    const card = await this.CardsRepository.getCardById(id);

    if(!card) throw new NotFoundException();
    if(card.userId !== userId) throw new ForbiddenException();

    return { ...card, password: this.cryptr.decrypt(card.password), cvv: this.cryptr.decrypt(card.cvv)}
}

async deleteCard(id: number, userId: number){
    const Card = await this.CardsRepository.getCardById(id);

    if(!Card) throw new NotFoundException();
    if(Card.userId !== userId) throw new ForbiddenException();

    return this.CardsRepository.deleteCard(id, userId);
}
}

