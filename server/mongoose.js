var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://isandeep:sand54321@ds133621.mlab.com:33621/todoapp12'
};
mongoose.connect(db.localhost || db.mlab);
module.exports ={mongoose};
