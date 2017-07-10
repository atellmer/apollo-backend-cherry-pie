import * as bcrypt from 'bcryptjs';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { secretKey } from '../config/init';


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

function validateToken(authToken: string) {
  const promise = new Promise((resolve, reject) => {
    authToken = authToken.replace('JWT', '').trim();

    jwt.verify(authToken, secretKey, (error, decoded) => {
      if (error) {
        throw new Error(`Decode token error: ${error}`);
      }

      resolve(decoded._id);
    });
  });

  return promise;
}

function protect() {
  return passport.authenticate('jwt', { session: false });
}

export {
  genSalt,
  hash,
  comparePasswords,
  validateToken,
  protect
}
