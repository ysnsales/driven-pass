import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCredentialDto } from "./dto/create-credential.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class CredentialsRepository {
    constructor(private readonly prisma: PrismaService) {}

    createCredential(createCredentialDto: CreateCredentialDto, userId: number) {
        return this.prisma.credential.create({
            data: { ...createCredentialDto,
                password: bcrypt.hashSync(createCredentialDto.password, 10),
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
}

