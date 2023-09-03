import { ConflictException, Injectable } from '@nestjs/common';
import { CredentialsRepository } from './credentials.repository';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsService {
    constructor(private readonly credentialsRepository: CredentialsRepository){}

    async createCredential(createCredentialDto: CreateCredentialDto, userId: number) {
        const checkCredential = await this.credentialsRepository.getCredentialPerUser(createCredentialDto.title, userId);
        if (checkCredential) throw new ConflictException();

        return this.credentialsRepository.createCredential(createCredentialDto, userId);
    }
}

