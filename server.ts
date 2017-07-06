import { join } from 'path';
import * as minimist from 'minimist';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as passport from 'passport';
import * as mongoose from 'mongoose';

import { port, database } from './src/config/init';
import { pasportConfigure  } from './src/config/passport';
import { router } from './src/routes';


mongoose.Promise = global.Promise;
const argv = minimist(process.argv.slice(2));
let PORT = port;

// npm run build:live -- --PORT=5000
if (argv.PORT) {
  PORT = parseInt(argv.PORT, 10);
}

mongoose.connect(database, {
  useMongoClient: true
});
mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${database}`);
});
mongoose.connection.on('error', err => {
  console.log(`Database error: ${err}`);
});

const app = express();

app.use(express.static(join(__dirname, 'static')));
app.use('*', cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

pasportConfigure(passport);

app.use('/', router);

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
