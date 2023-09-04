import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User } from '../decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('credentials')
@ApiBearerAuth()
@Controller('credentials')
export class CredentialsController {
    constructor(private readonly credentialService: CredentialsService) {}

    @Post()
    @ApiOperation({ summary: "Create a new credential" })
    createCredential(@Body() createCredentialDto: CreateCredentialDto, @User() user){
        const { id } = user;

        return this.credentialService.createCredential(createCredentialDto, id);
    }

    @Get()
    @ApiOperation({ summary: "Get all credentials from logged user" })
    getCredentials(@User() user){
        console.log(user);
        const { id } = user;
        return this.credentialService.getCredentials(id);
    }

    @Get(':id')
    @ApiOperation({ summary: "Get a specific credential" })
    getCredentialsByUserId(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.credentialService.getCredentialById(+id, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: "Delete a credential" })
    deleteCredential(@Param('id', ParseIntPipe) id: string, @User() user){
        const userId = user.id;

        return this.credentialService.deleteCredential(+id, userId)
    }
}
