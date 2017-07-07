import { Strategy, ExtractJwt } from 'passport-jwt';

import * as User from '../models/user';
import { User as UserType } from '../types/user';
import { secretKey } from '../config/init';


function pasportConfigure(passport) {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: secretKey
  };

  passport.use(jwtInit(options));
}

function jwtInit(options) {
  return new Strategy(options, (jwtPayload, done) => {
    const { _doc: { _id } } = jwtPayload;

    User.getUserById(_id)
    .then((user: UserType) => {
      if (user) {
        const authorizedUser = {
          _id: user._id,
          name: user.name,
          email: user.email
        };

        return done(null, authorizedUser);
      } else {
        return done(null, false);
      }
    })
    .catch((err: Error) => {
      return done(err, false);
    })
  });
}

export {
  pasportConfigure
}
