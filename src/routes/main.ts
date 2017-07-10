import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import {
  userConnector,
  getUserByEmail,
  addUser
} from '../features/user';
import { UserType } from '../features/user';
import {
  PORT,
  SECRETKEY,
  EXPIRATION_TOKEN
} from '../config';
import { comparePasswords, protect } from '../features/auth';
import { schema } from '../schema';


const ROUTES = {
  GRAPHQL: '/graphql',
  GRAPHIQL: '/graphIql',
  WEBSOCKETS: '/subscriptions',
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  PROTECT: '/protect'
}
const router = Router();

router.use(ROUTES.GRAPHQL, protect(), graphqlExpress({
  schema
}));

router.use(ROUTES.GRAPHIQL, graphiqlExpress({
  endpointURL: ROUTES.GRAPHQL,
  subscriptionsEndpoint: `ws://localhost:${PORT}${ROUTES.WEBSOCKETS}`
}));

router.post(ROUTES.SIGNUP, (req, res, next) => {
  const { body: { email } } = req;

  getUserByEmail(email)
    .then((existingUser: UserType) => {
      if (!existingUser) {
        const newUser = new userConnector({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        addUser(newUser)
          .then((user: UserType) => {
            res.json({
              success: true,
              msg: 'User registered'
            });
          })
          .catch(err => {
            res.json({
              success: false,
              msg: 'Failed register user'
            });
          });
      } else {
        return res.json({
          success: false,
          msg: 'User already exist!'
        });
      }
    })
    .catch(err => {
      throw err;
    });
});

router.post(ROUTES.SIGNIN, (req, res, next) => {
  const { body: { email, password } } = req;

  getUserByEmail(email)
    .then((user: UserType) => {
      if (!user) {
        return res.json({
          success: false,
          msg: 'Wrong email or password'
        });
      }
      return user;
    })
    .then((user: UserType) => {
      comparePasswords(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const existUser = {
              _id: user._id,
              name: user.name,
              email: user.email
            };
            const token = sign(existUser, SECRETKEY, {
              expiresIn: EXPIRATION_TOKEN
            });

            res.json({
              success: true,
              token: `JWT ${token}`,
              user: existUser
            });
          } else {
            return res.json({
              success: false,
              msg: 'Wrong email or password'
            });
          }
        });
    })
    .catch(err => {
      throw err;
    });
});

router.get(ROUTES.PROTECT, protect(), (req, res, next) => {
  res.json({
    user: req['user']
  });
});

export {
  router,
  ROUTES
};
