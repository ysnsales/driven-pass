import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../../src/prisma/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";
import { cleanDb } from "../helpers";
import { createUser } from "../factories/user.factory";
import * as request from 'supertest';
import { createCredential } from "../factories/credential.factory";

describe('CredentialsController (e2e', () => {
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

    describe('POST /credentials', () => {
      it('Should create a new credential', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const credential = createCredential(user.id);

        const response = await request(app.getHttpServer()).post('/credentials').set('Authorization', `Bearer ${token}`).send(credential);
        expect(response.status).toEqual(HttpStatus.CREATED);
      });

      it('Should return 401 when token is invalid', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const credential = createCredential(user.id);

        const response = await request(app.getHttpServer()).post('/credentials').set('Authorization', `Bearer token`).send(credential);
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Should return 400 when body is invalid', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const credential = createCredential(user.id);

        const response = await request(app.getHttpServer()).post('/credentials').set('Authorization', `Bearer ${token}`).send({...credential, title:null });
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Should return 409 when title already exists', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
        const object = login.text
        const token = object.substring(10, object.length-2)
        const credential = createCredential(user.id);

        await request(app.getHttpServer()).post('/credentials').set('Authorization', `Bearer ${token}`).send(credential);
        const response = await request(app.getHttpServer()).post('/credentials').set('Authorization', `Bearer ${token}`).send({...credential, id: 11});
        expect(response.status).toEqual(HttpStatus.CONFLICT);
      })
    });

    describe('GET /credentials', () => {
        it('Shoul get users credentials', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
            const object = login.text
            const token = object.substring(10, object.length-2)
            const credential = createCredential(user.id);
    
            await request(app.getHttpServer()).post('/credentials').set('Authorization', `Bearer ${token}`).send(credential);
            const response = await request(app.getHttpServer()).get('/credentials').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(HttpStatus.OK)

        });

        it('Should return 401 when token is invalid', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const credential = createCredential(user.id);
    
            const response = await request(app.getHttpServer()).post('/credentials').set('Authorization', `Bearer token`).send(credential);
            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
          });
    })

    describe('GET /credentials/:id', () => {
        it('Shoul get user credential by id', async() => {
            const user = createUser();
            await request(app.getHttpServer()).post('/users/sign-up').send(user);
            const login = await request(app.getHttpServer()).post('/users/sign-in').send(user);
            const object = login.text
            const token = object.substring(10, object.length-2)
            const credential = createCredential(user.id);
    
            const credentialResponse = await request(app.getHttpServer()).post('/credentials').set('Authorization', `Bearer ${token}`).send(credential);
            const response = await request(app.getHttpServer()).get(`/credentials/${credentialResponse.body.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(HttpStatus.OK)

        });
    })



})