import { makeExecutableSchema } from 'graphql-tools';
import { mergeAll } from 'ramda';

import {
  schema as userSchema,
  resolvers as userResolvers
} from './features/user';


const schema = [...userSchema];
const resolvers = mergeAll([userResolvers]);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export { executableSchema };
