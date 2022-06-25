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

const getResolver = (fieldName, mockResolve) => (source, args, context, info) => {
  const randomNum = Math.random();

  if (fieldName.startsWith(AUTH_PREFIX)) {
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
}

const getResolversByFields = (fields, mockFields) => Object.values(fields).reduce((acc, field) => {
  const fieldName = field.name;
  const mockResolve = mockFields[fieldName].resolve;

  return {
    ...acc,
    [fieldName]: getResolver(fieldName, mockResolve),
  };
}, {})

const resolvers = () => {
  const schemaQueryFields = schema.getQueryType().getFields();
  const mockSchemaQueryFields = mockSchema.getQueryType().getFields();

  const schemaMutationFields = schema.getMutationType().getFields();
  const mockSchemaMutationFields = mockSchema.getMutationType().getFields();

  const Query = getResolversByFields(schemaQueryFields, mockSchemaQueryFields);
  const Mutation = getResolversByFields(schemaMutationFields, mockSchemaMutationFields);

  return { Query, Mutation };
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
