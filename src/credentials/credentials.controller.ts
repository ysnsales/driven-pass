import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User } from '../decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
    constructor(private readonly credentialService: CredentialsService) {}

    @Post()
    createCredential(@Body() createCredentialDto: CreateCredentialDto, @User() user){
        const { id } = user;

        return this.credentialService.createCredential(createCredentialDto, id);
    }

    @Get()
    getCredentials(@User() user){
        console.log(user);
        const { id } = user;
        return this.credentialService.getCredentials(id);
    }

    @Get(':id')
    getCredentialsByUserId(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.credentialService.getCredentialById(+id, userId);
    }
}
