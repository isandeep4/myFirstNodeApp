const {mongoose} = require('./server/mongoose');
const {User} = require('./server/models/user');
const {ObjectID} = require('mongoose');

const id = '5bb8d66604438a0b14741b1f';

User.findById(id).then((user) => {
  if(!user) {
    return console.log('user is not found')
  }
  console.log('user by Id', user)
}).catch((e)=> console.log(e));
