import { createServer, GraphQLYogaError } from '@graphql-yoga/node';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import typeDefs from './schemas/index.mjs';
import mocks from './mocks/index.mjs';

const schema = makeExecutableSchema({ typeDefs });

const schemaWithMocks = addMocksToSchema({
  schema,
  mocks,
  resolvers: (_store) => ({
    Query: {
      error: (_, _args, context) => {
        throw new GraphQLYogaError('User with id not found.');
      },
    },
  }),
});

// Create your server
const server = createServer({
  schema: schemaWithMocks
});
// start the server and explore http://localhost:4000/graphql
server.start();
