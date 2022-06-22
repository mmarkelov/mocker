import { createServer, GraphQLYogaError } from '@graphql-yoga/node';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import typeDefs from './schemas/index.mjs';
import mocks from './mocks/index.mjs';

const ERROR_ARG = 'err';

const schema = makeExecutableSchema({ typeDefs });

const mockSchema = addMocksToSchema({
  schema,
  mocks,
});

const resolvers = () => {
  const schemaFields = schema.getQueryType().getFields()
  const Query = Object.values(schemaFields).reduce((acc, field) => {
    if (field.args.find(item => item.name === ERROR_ARG)) {
      return {...acc, [field.name]: (source, args, context, info) => {
          if (args.err) {
            throw new GraphQLYogaError('Error');
          }

          const mockResolve = mockSchema.getQueryType().getFields()[field.name].resolve;

          return mockResolve(source, args, context, info);
        }}
    }
    return acc
  }, {});

  return {Query}
}


const schemaWithMocks = addMocksToSchema({
  schema,
  mocks,
  resolvers,
});

// Create your server
const server = createServer({
  schema: schemaWithMocks
});

server.start();
