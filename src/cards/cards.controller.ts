import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { User } from '../decorators/user.decorator';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('cards')
@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Post()
    @ApiOperation({ summary: "Create a new card" })
    createCard(@Body() createCardDto: CreateCardDto, @User() user){
        const { id } = user;

        return this.cardsService.createCard(createCardDto, id);
    }

    @Get()
    @ApiOperation({ summary: "Get all cards from logged user" })
    getCards(@User() user){
        console.log(user);
        const { id } = user;
        return this.cardsService.getCards(id);
    }

    @Get(':id')
    @ApiOperation({ summary: "Get a specific card" })
    getCardsByUserId(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.cardsService.getCardById(+id, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: "Delete a card" })
    deleteCard(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.cardsService.deleteCard(+id, userId)
    }

}
