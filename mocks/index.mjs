import { faker } from '@faker-js/faker';

const mocks = {
  User: () => ({
    name: faker.name.findName(),
  }),
};

export default mocks;
