const schema = [`
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

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`];

export { schema };
