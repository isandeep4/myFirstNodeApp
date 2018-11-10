const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log('unable to connect')
  }
  console.log('connected to db');
  db.collection('todos').find().toArray().then((docs)=>{
    console.log('todos')
    console.log(JSON.stringify(docs,undefined,2));
  },(error)=>{
    console.log('unable to find data')
  });
  db.close();
})
