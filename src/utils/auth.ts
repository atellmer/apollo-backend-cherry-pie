import * as bcrypt from 'bcryptjs';
import * as passport from 'passport';


function genSalt() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      resolve(salt);
    });
  });
}

function hash(password, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hashPass) => {
      if (err) {
        reject(err);
      }
      resolve(hashPass);
    });
  });
}

function comparePasswords(candidatePass, hashPass) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePass, hashPass, (err, isMatch) => {
      if (err) {
        reject(err);
      }
      resolve(isMatch);
    });
  });
}

function protect() {
  return passport.authenticate('jwt', { session: false });
}

export {
  genSalt,
  hash,
  comparePasswords,
  protect
}
