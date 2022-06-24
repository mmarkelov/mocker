import { createServer, GraphQLYogaError } from '@graphql-yoga/node';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import typeDefs from './schemas/index.mjs';
import mocks from './mocks/index.mjs';

const AUTH_PREFIX = 'auth';

const VARIANTS = {
  error: 0.5,
};

const schema = makeExecutableSchema({ typeDefs });

const mockSchema = addMocksToSchema({
  schema,
  mocks,
});

const resolvers = () => {
  const schemaFields = schema.getQueryType().getFields();
  const mockSchemaFields = mockSchema.getQueryType().getFields();

  const Query = Object.values(schemaFields).reduce((acc, field) => {
    const mockResolve = mockSchemaFields[field.name].resolve;

    return {
      ...acc,
      [field.name]: (source, args, context, info) => {
        const randomNum = Math.random();

        if (field.name.startsWith(AUTH_PREFIX)) {
          const token = context.request.headers.get('authorization');
          if (!token) {
            throw new GraphQLYogaError('Unauthorized', {
              code: 'UNAUTHORIZED',
            });
          }
        }

        if (randomNum < VARIANTS.error) {
          throw new GraphQLYogaError('Error');
        }

        return mockResolve(source, args, context, info);
      },
    };
  }, {});

  return { Query };
};

const schemaWithMocks = addMocksToSchema({
  schema,
  mocks,
  resolvers,
});

// Create your server
const server = createServer({
  schema: schemaWithMocks,
});

// server.start();

export { server };
