import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCredentialDto } from "./dto/create-credential.dto";
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsRepository {
    constructor(private readonly prisma: PrismaService) {}

    createCredential(createCredentialDto: CreateCredentialDto, userId: number) {
        return this.prisma.credential.create({
            data: { ...createCredentialDto,
                 userId}
        })
    }

    getCredentialPerUser(title: string, userId: number) {
        return this.prisma.credential.findFirst({
            where: {
                userId,
                title
            }
        })
    }

    getCredentials(userId: number) {
        return this.prisma.credential.findMany({
            where: {userId}
        })
    }

    getCredentialById(id: number) {
        return this.prisma.credential.findFirst({
            where: {id}
        })
        
    }

    deleteCredential(id: number, userId: number){
        return this.prisma.credential.delete({
            where:{
                id,
                userId
            }
        })
    }
}


