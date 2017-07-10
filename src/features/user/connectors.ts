import { Schema, model } from 'mongoose';

import {
  generateSalt,
  generateHash
} from '../auth';
import { UserType } from './types';


const UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const userConnector = model('User', UserSchema);

function getUserById(id: string) {
  return new Promise((resolve, reject) => {
    userConnector.findById(id, (err: Error, user: UserType) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

function getUserByEmail(email: string) {
  return new Promise((resolve, reject) => {
    userConnector.findOne({ email }, (err: Error, user: UserType) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

function addUser(newUser: any) {
  return new Promise((resolve, reject) => {
    generateSalt()
    .then((salt: string) => generateHash(newUser.password, salt))
    .then((hashPass: string) => saveUser(newUser, hashPass))
    .then((user: UserType) => {
      resolve(user);
    })
    .catch((err: Error) => {
      reject(err);
    });
  });
}

function saveUser(newUser: any, hashPass: string) {
  return new Promise((resolve, reject) => {
    newUser.password = hashPass;
    newUser.save((err: Error, user: UserType) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

export {
  userConnector,
  getUserById,
  getUserByEmail,
  addUser
};
