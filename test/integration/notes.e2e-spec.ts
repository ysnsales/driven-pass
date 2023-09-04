import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../../src/prisma/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";
import { cleanDb } from "../helpers";
import { createUser } from "../factories/user.factory";
import * as request from 'supertest';
import { createNote } from "../factories/notes.factory";

describe('notesController (e2e', () => {
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

    describe('POST /notes', () => {
      it('Should create a new note', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const note = createNote(user.id);

        const response = await request(app.getHttpServer()).post('/notes').set('Authorization', `Bearer ${token}`).send(note);
        expect(response.status).toEqual(HttpStatus.CREATED);
      });

      it('Should return 401 when token is invalid', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const note = createNote(user.id);

        const response = await request(app.getHttpServer()).post('/notes').set('Authorization', `Bearer token`).send(note);
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Should return 400 when body is invalid', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const note = createNote(user.id);

        const response = await request(app.getHttpServer()).post('/notes').set('Authorization', `Bearer ${token}`).send({...note, title:null });
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Should return 409 when title already exists', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const note = createNote(user.id);

        await request(app.getHttpServer()).post('/notes').set('Authorization', `Bearer ${token}`).send(note);
        const response = await request(app.getHttpServer()).post('/notes').set('Authorization', `Bearer ${token}`).send({...note, id: 11});
        expect(response.status).toEqual(HttpStatus.CONFLICT);
      })
    });

    describe('GET /notes', () => {
        it('Shoul get users notes', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
            const object = login.text
            const token = object.substring(10, object.length-2)
            const note = createNote(user.id);
    
            await request(app.getHttpServer()).post('/notes').set('Authorization', `Bearer ${token}`).send(note);
            const response = await request(app.getHttpServer()).get('/notes').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(HttpStatus.OK)

        });

        it('Should return 401 when token is invalid', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const note = createNote(user.id);
    
            const response = await request(app.getHttpServer()).post('/notes').set('Authorization', `Bearer token`).send(note);
            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
          });
    })

    describe('GET /notes/:id', () => {
        it('Shoul get user note by id', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
            const object = login.text
            const token = object.substring(10, object.length-2)
            const note = createNote(user.id);
    
            const noteResponse = await request(app.getHttpServer()).post('/notes').set('Authorization', `Bearer ${token}`).send(note);
            const response = await request(app.getHttpServer()).get(`/notes/${noteResponse.body.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(HttpStatus.OK)

        });
    })



})