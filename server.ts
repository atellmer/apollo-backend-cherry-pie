import { createServer } from 'http';
import { join } from 'path';
import * as express from 'express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as passport from 'passport';
import * as mongoose from 'mongoose';

import { PORT, DB } from './src/config';
import { configurePassport, validateToken } from './src/features/auth';
import { router, ROUTES } from './src/routes/main';
import { schema } from './src/schema';
import { getUserById } from './src/features/user';


mongoose.Promise = global.Promise;
mongoose.connect(DB, {
  useMongoClient: true
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`Connected to database: ${DB}`);
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

configurePassport(passport);

server.use('/', router);

const websocketServer = createServer(server);

websocketServer.listen(PORT, () => {
  const subscriptionServer = new SubscriptionServer({
    execute,
    subscribe,
    schema,
    onConnect: (connectionParams, webSocket) => {
      if (connectionParams.authToken) {
        return validateToken(connectionParams.authToken)
          .then((id: string) => getUserById(id))
          .then(user => {
            console.log('curren user: ', user);
            return {
              currentUser: user,
            };
          });
      }
      throw new Error('Missing auth token!');
    }
  },
  {
    server: websocketServer,
    path: ROUTES.WEBSOCKETS,
  });

  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
});
