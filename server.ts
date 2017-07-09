import { createServer } from 'http';
import { join } from 'path';
import * as express from 'express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as passport from 'passport';
import * as mongoose from 'mongoose';

import { port, database } from './src/config/init';
import { pasportConfigure  } from './src/config/passport';
import { router } from './src/routes';
import { schema } from './src/graphql/schema';


mongoose.Promise = global.Promise;
mongoose.connect(database, {
  useMongoClient: true
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`Connected to database: ${database}`);
});
db.on('error', err => {
  console.log(`Database error: ${err}`);
});

const server = express();

server.use(express.static(join(__dirname, 'static')));
server.use('*', cors());
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(passport.session());

pasportConfigure(passport);

server.use('/', router);

const ws = createServer(server);

ws.listen(port, () => {
  const subscriptionServer = new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });

  console.log(`GraphQL Server is now running on http://localhost:${port}`);
});
