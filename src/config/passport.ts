import { Strategy, ExtractJwt } from 'passport-jwt';

import * as User from '../models/user';
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
    User.getUserById(jwtPayload._doc._id)
    .then(user => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch(err => {
      return done(err, false);
    })
  });
}

export {
  pasportConfigure
}
