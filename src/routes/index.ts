import * as express from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import * as User from '../models/user';
import { User as UserType } from '../types/user';
import { secretKey } from '../config/init';
import { comparePasswords } from '../utils/auth';
import { schema } from '../graphql/schema';


const router = express.Router();

router.use('/graphql', graphqlExpress({
  schema
}));

router.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

router.post('/signup', (req, res, next) => {
  const email = req.body.email;

  User.getUserByEmail(email)
    .then((existingUser: UserType) => {
      if (!existingUser) {
        const newUser = new User.model({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        User.addUser(newUser)
          .then((user: UserType) => {
            res.json({ success: true, msg: 'User registered' });
          })
          .catch(err => {
            res.json({ success: false, msg: 'Failed register user' });
          });
      } else {
        return res.json({ success: false, msg: 'User already exist!' });
      }
    })
    .catch(err => {
      throw err;
    });
});

router.post('/signin', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email)
    .then((user: UserType) => {
      if (!user) {
        return res.json({ success: false, msg: 'Wrong email or password' });
      }
      return user;
    })
    .then((user: UserType) => {
      comparePasswords(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const token = jwt.sign(user, secretKey, {
              expiresIn: 604800
            });

            res.json({
              success: true,
              token: `Bearer ${token}`,
              user: {
                _id: user._id,
                name: user.name,
                email: user.email
              }
            });
          } else {
            return res.json({ success: false, msg: 'Wrong email or password' });
          }
        });
    })
    .catch(err => {
      throw err;
    });
});

export {
  router
};
