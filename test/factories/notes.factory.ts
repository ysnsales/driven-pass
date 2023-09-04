import { faker } from '@faker-js/faker';

export function createNote(userId: number) {
    return {
        id: faker.number.int({ min: 1, max: 10 }),
        title: faker.internet.domainWord(),
        text: faker.internet.emoji(),
        userId
    };
}