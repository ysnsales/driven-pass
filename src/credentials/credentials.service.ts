import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CredentialsRepository } from './credentials.repository';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsService {
    constructor(private readonly credentialsRepository: CredentialsRepository){}

    async createCredential(createCredentialDto: CreateCredentialDto, userId: number) {
        const checkCredential = await this.credentialsRepository.getCredentialPerUser(createCredentialDto.title, userId);
        if (checkCredential) throw new ConflictException("This title already exists!");

        return this.credentialsRepository.createCredential(createCredentialDto, userId);
    }

    async getCredentials(userId: number) {
        return this.credentialsRepository.getCredentials(userId);
    }

    async getCredentialById(id: number, userId: number) {
        const credential = await this.credentialsRepository.getCredentialById(id);

        if(!credential) throw new NotFoundException();
        if(credential.userId !== userId) throw new ForbiddenException();

        return credential;
    }
}

