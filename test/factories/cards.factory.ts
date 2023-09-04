import { faker } from '@faker-js/faker';

export function createCard(userId: number) {
    return {
        id: faker.number.int({ min: 1, max: 10 }),
        title: faker.company.name(),
        name: faker.company.name(),
        number: '1234567891012345',
        expirationDate: '12/24',
        password: 's3nh4F0rt3!',
        type: 'CREDIT',
        userId
    };
}