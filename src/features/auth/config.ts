import { Strategy, ExtractJwt } from 'passport-jwt';

import { getUserById } from '../user';
import { UserType } from '../user';
import { SECRETKEY } from '../../config';


function configurePassport(passport) {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: SECRETKEY
  };

  passport.use(jwtInit(options));
}

function jwtInit(options) {
  return new Strategy(options, (jwtPayload, done) => {
    const { _id } = jwtPayload;

    getUserById(_id)
      .then((user: UserType) => {
        if (user) {
          const authorizedUser = {
            _id: user._id,
            name: user.name,
            email: user.email
          };

          return done(null, authorizedUser);
        }

        return done(null, false);
      })
      .catch((err: Error) => {
        return done(err, false);
      })
  });
}

export {
  configurePassport
}
