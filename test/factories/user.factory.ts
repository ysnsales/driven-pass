import { faker } from '@faker-js/faker';

export function createUser() {
    return {
        id: faker.number.int({ min: 1, max: 10 }),
        email: faker.internet.email(),
        password: 's3nh4F0rt3!'
    };
}