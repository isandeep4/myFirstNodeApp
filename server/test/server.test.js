const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text:'first test todo'
},{
  _id: new ObjectID(),
  text:'second test todo'
}];

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('shouldnt create a new todo',()=>{
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);

      })
      .catch((e)=>done(e));
    })
  })

});

describe('GET /todos' , () => {
  it('should get all todos' , (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done)
  })
});

describe('GET /todos/id', () => {
  it('should get the todo by id' , (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  })

  it('should return 404 if no todo found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done)

  });
  it('should return 404 for non-object ids' , (done) => {
    request(app)
    .get('/todos/123a')
    .expect(404)
    .end(done)
  })
});

describe('DELETE /todos/:id' , () => {
  it('should remove todo by id' , (done) => {

    var id = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(id);
    })
    .end((err,res)=>{
      if(err){
        return done(err)
      }
      Todo.findById(id).then((todo)=>{
        expect(todo).toNotExist();
        done();
      }).catch((e)=>done(e));

    })
  })
});

describe('PATCH /todos/:id' , () => {
  it('should update todo by id' , (done) => {
    var id = todos[0]._id.toHexString();
    var text = 'text is changed';

    request(app)
    .patch(`/todos/${id}`)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo[0].text).toBe(text);
      expect(res.body.todo[0].completed).toBe(true);
      expect(res.body.todo[0].completedAt).toBeA('number');
    })
    .end(done);

  })
})
