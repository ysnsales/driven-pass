import { faker } from '@faker-js/faker';

export function createUser() {
    return {
        email: faker.internet.email(),
        password: 's3nh4F0rt3!'
    };
}