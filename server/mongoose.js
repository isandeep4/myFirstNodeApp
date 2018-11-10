var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// let db = {
//   localhost: 'mongodb://localhost:27017/TodoApp',
//   mlab: 'mongodb://isandeep:sand54321@ds133621.mlab.com:33621/todoapp12'
// };
mongoose.connect('mongodb://127.0.0.1:27017/TodoApp',{useMongoClient: true});
module.exports ={mongoose};
