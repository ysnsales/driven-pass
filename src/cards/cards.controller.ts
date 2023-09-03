import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { User } from '../decorators/user.decorator';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Post()
    createCard(@Body() createCardDto: CreateCardDto, @User() user){
        const { id } = user;

        return this.cardsService.createCard(createCardDto, id);
    }

    @Get()
    getCards(@User() user){
        console.log(user);
        const { id } = user;
        return this.cardsService.getCards(id);
    }

    @Get(':id')
    getCardsByUserId(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.cardsService.getCardById(+id, userId);
    }

    @Delete(':id')
    deleteCard(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.cardsService.deleteCard(+id, userId)
    }

}
