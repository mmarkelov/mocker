import { faker } from '@faker-js/faker';

const mocks = {
  User: () => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
  }),
};

export default mocks;
