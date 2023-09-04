import { faker } from '@faker-js/faker';

export function createCredential(userId: number) {
    return {
        id: faker.number.int({ min: 1, max: 10 }),
        title: faker.internet.domainWord(),
        url: faker.internet.domainName(),
        username: faker.person.firstName(),
        password: 's3nh4F0rt3!',
        userId
    };
}