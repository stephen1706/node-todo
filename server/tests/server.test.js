const expect = require('expect');
const request= require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text:"first test todo"
  }, {
    _id: new ObjectID(),
    text:"second test todo"
  }
]
beforeEach((done) => {//bersihin db dulu seblm test mulai
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(()=> done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'test todo text';

    request(app)
    .post('/todos')
    .send({
      text//mksdny text:text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((newTodos) => {
          expect(newTodos.length).toBe(todos.length + 1);
          expect(newTodos[todos.length].text).toBe(text);
          done();
      }).catch((e) => done(e));
    });
  })

  it('it should not create a new todo with invalid body', (done) => {
    var text = '';

    request(app)
    .post('/todos')
    .send({
      text//mksdny text:text
    })
    .expect(400)
    .end((err,res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) => {
          expect(todos.length).toBe(todos.length);
          done();
      }).catch((e) => done(e));
    });
  })
});

describe('GET /todos', () => {
  it('should get all todo', (done) => {
    var text = 'test todo text';

    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(todos.length);
    })
    .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should get return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(todos[0].text);
    })
    .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/5970763f9c33ce2100fa85cx`)
    .expect(404)
    .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should return 404 for invalid', (done) => {
    request(app)
    .get(`/todos/123`)
    .expect(404)
    .end(done);
  })
});
