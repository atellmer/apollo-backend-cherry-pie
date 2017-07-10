import {
  genSalt,
  hash,
  compare
} from 'bcryptjs';
import { authenticate } from 'passport';
import { verify } from 'jsonwebtoken';
import { SECRETKEY } from '../../config';


function generateSalt() {
  return new Promise((resolve, reject) => {
    genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      resolve(salt);
    });
  });
}

function generateHash(password, salt) {
  return new Promise((resolve, reject) => {
    hash(password, salt, (err, hashPass) => {
      if (err) {
        reject(err);
      }
      resolve(hashPass);
    });
  });
}

function comparePasswords(candidatePass, hashPass) {
  return new Promise((resolve, reject) => {
    compare(candidatePass, hashPass, (err, isMatch) => {
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

    verify(authToken, SECRETKEY, (error, decoded) => {
      if (error) {
        reject(`decode token error: ${error}`);
      }

      resolve(decoded._id);
    });
  });

  return promise;
}

function protect() {
  return authenticate('jwt', { session: false });
}

export {
  generateSalt,
  generateHash,
  comparePasswords,
  validateToken,
  protect
}
