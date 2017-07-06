import * as mongoose from 'mongoose';

import { genSalt, hash } from '../utils/auth';
import { User as UserType } from '../types/user';


const UserSchema = mongoose.Schema({
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

const model = mongoose.model('User', UserSchema);

function getUserById(id: string) {
  return new Promise((resolve, reject) => {
    model.findById(id, (err: Error, user: UserType) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

function getUserByEmail(email: string) {
  return new Promise((resolve, reject) => {
    model.findOne({ email }, (err: Error, user: UserType) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

function addUser(newUser: any) {
  return new Promise((resolve, reject) => {
    genSalt()
    .then((salt: string) => hash(newUser.password, salt))
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
  model,
  getUserById,
  getUserByEmail,
  addUser
};
