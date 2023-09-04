import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../../src/prisma/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";
import { cleanDb } from "../helpers";
import { createUser } from "../factories/user.factory";
import * as request from 'supertest';

describe('UsersController (e2e', () => {
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

    describe('POST /users/sign-up', () => {
      it('Should create a new user', async() => {
        const user = createUser();
        const response = await request(app.getHttpServer()).post('/users/sign-up').send(user);

        expect(response.status).toEqual(HttpStatus.CREATED);
      });

      it('Should return 409 when email is already in use', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const response = await request(app.getHttpServer()).post('/users/sign-up').send(user);

        expect(response.status).toEqual(HttpStatus.CONFLICT);
      });

      it('Should return 400 when body is invalid', async() => {
        const user = createUser();
        const response = await request(app.getHttpServer()).post('/users/sign-up').send({email: 'fulano', password: user.password});

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      });
    });

    
    describe('POST /users/sign-in', () => {
      it('Should return token', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const response = await request(app.getHttpServer()).post('/users/sign-in').send(user);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toEqual({token: expect.any(String)});
      });

      it('Should return status 401 when email is wrong', async() => {
        const user = createUser();
        await request(app.getHttpServer()).post('/users/sign-up').send(user);
        const response = await request(app.getHttpServer()).post('/users/sign-in').send({email: 'fulano@gmail.com', password: user.password});

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      });

        it('Should return status 401 when password is wrong', async() => {
          const user = createUser();
          await request(app.getHttpServer()).post('/users/sign-up').send(user);
          const response = await request(app.getHttpServer()).post('/users/sign-in').send({email: user.email, password: "1234567981"});
  
          expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
        });

    });

})