const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log('unable to connect')
  }
  db.collection('todos').findOneAndDelete({
    _id:new ObjectID('5b4451369c48bd100cfb7376')
  }).then((results)=>{
    console.log(JSON.stringify(results,undefined,2))
  },(error)=>{
    return console.log('unable to delete',error);
  })
})
