const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err , client) => {
	if(err){
		return console.log('unable to connect to mongodb server');
	}
	 console.log('connected to  server');
	 const db = client.db('TodoApp')

	 //db.collection('Todos').insertOne({
	//	 text: 'something to do',
	//	 completed: false
	 //}, (err , results) => {
	//	 if(err){
	//		 return console.log('unable to insert',err);
	//	 }
	//	 console.log(JSON.stringify(results.ops, undefined, 2))
	 //});
	 db.collection('Todos').findOneAndUpdate({completed:false},$set:{completed:true},{ returnOriginal:false}).then((result) => {
		 console.log(result);
	 });

	 client.close();
});
