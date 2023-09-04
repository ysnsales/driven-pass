import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../../src/prisma/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";
import { cleanDb } from "../helpers";
import { createUser } from "../factories/user.factory";
import * as request from 'supertest';
import { createCard } from "../factories/cards.factory";

describe('cardsController (e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService = new PrismaService();
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, JwtModule.register({secret: process.env.JWT_SECRET})],
          })
            .overrideProvider(PrismaService)
            .useValue(prisma)
            .compile();
      
          app = moduleFixture.createNestApplication();
          app.useGlobalPipes(new ValidationPipe());
          jwtService = app.get(JwtService);
          await app.init();
      
          await cleanDb(prisma);
    });

    describe('POST /cards', () => {
      it('Should create a new card', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const card = createCard(user.id);

        const response = await request(app.getHttpServer()).post('/cards').set('Authorization', `Bearer ${token}`).send(card);
        expect(response.status).toEqual(HttpStatus.CREATED);
      });

      it('Should return 401 when token is invalid', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const card = createCard(user.id);

        const response = await request(app.getHttpServer()).post('/cards').set('Authorization', `Bearer token`).send(card);
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Should return 400 when body is invalid', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const card = createCard(user.id);

        const response = await request(app.getHttpServer()).post('/cards').set('Authorization', `Bearer ${token}`).send({...card, title:null });
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Should return 409 when title already exists', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const card = createCard(user.id);

        await request(app.getHttpServer()).post('/cards').set('Authorization', `Bearer ${token}`).send(card);
        const response = await request(app.getHttpServer()).post('/cards').set('Authorization', `Bearer ${token}`).send({...card, id: 11});
        expect(response.status).toEqual(HttpStatus.CONFLICT);
      })
    });

    describe('GET /cards', () => {
        it('Shoul get users cards', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
            const object = login.text
            const token = object.substring(10, object.length-2)
            const card = createCard(user.id);
    
            await request(app.getHttpServer()).post('/cards').set('Authorization', `Bearer ${token}`).send(card);
            const response = await request(app.getHttpServer()).get('/cards').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(HttpStatus.OK)

        });

        it('Should return 401 when token is invalid', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const card = createCard(user.id);
    
            const response = await request(app.getHttpServer()).post('/cards').set('Authorization', `Bearer token`).send(card);
            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
          });
    })

    describe('GET /cards/:id', () => {
        it('Shoul get user card by id', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
            const object = login.text
            const token = object.substring(10, object.length-2)
            const card = createCard(user.id);
    
            const cardResponse = await request(app.getHttpServer()).post('/cards').set('Authorization', `Bearer ${token}`).send(card);
            const response = await request(app.getHttpServer()).get(`/cards/${cardResponse.body.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(HttpStatus.OK)

        });
    })



})