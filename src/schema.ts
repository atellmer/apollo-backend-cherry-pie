import { makeExecutableSchema } from 'graphql-tools';

import { userResolvers } from './features/user';


const typeDefs = `
  type Channel {
    id: ID!
    name: String
    messages: [Message]!
  }

  input MessageInput{
    channelId: ID!
    text: String
  }

  type Message {
    id: ID!
    text: String
  }

  type Query {
    channels: [Channel]
    channel(id: ID!): Channel
  }

  type Mutation {
    addChannel(name: String!): Channel
    addMessage(message: MessageInput!): Message
  }

  type Subscription {
    messageAdded(channelId: ID!): Message
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers: userResolvers });

export { schema };
