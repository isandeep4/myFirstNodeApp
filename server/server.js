var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    var todo = new Todo({
      text: req.body.text
    });
    todo.save().then((doc) => {
      res.send(doc);
    },(e) => {
      res.status(400).send(e);
    });
});
app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  })
})
app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('id is not valid');
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err)=>{
    res.status(500).send(err);
  })
});

app.delete('/todos/:id', (req,res) => {

  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('id is not valid')
  }
  Todo.findByIdAndRemove(id).then((todo)=> {
    if(!todo){
      res.status(404).send();
    }

    res.send(todo)
  }).catch((e)=>{
    res.status(400).send()
  })

});
app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed'])
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false ;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body},{new: true}).then((todo) => {
      if(!todo){
        return res.status(400).send();
      }
      res.send({todo});
    })
});

app.post('/users' , (req,res) => {
  var body = _.pick(req.body , ['email' , 'password'])
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {

    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
})
app.get('/users/me',(req,res) => {
  var token = req.header('x-auth');
  console.log('token',token);

  User.findByToken(token).then((user) => {
    

    if(!user){
      return Promise.reject();

    }
    res.send(user);
  }).catch((e)=>{
    res.status(401).send();
  })
})

app.listen(port, () => {
  console.log(`started on port ${port}`);
})

module.exports = {app};
