import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
