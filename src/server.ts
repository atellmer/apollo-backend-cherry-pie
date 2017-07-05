import * as express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { schema } from './graphql/schema';


const PORT = 4000;
const server = express();

server.use('*', cors({ origin: 'http://localhost:3000' }));
server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

server.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
