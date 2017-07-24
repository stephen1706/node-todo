const expect = require('expect');
const request= require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'test todo text';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should get return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(todos[0].text);
    })
    .end(done);
  })
});

  it('should not return todo doc due to different creator', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

describe('GET /todos/:id', () => {
  it('should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/5970763f9c33ce2100fa85cx`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should return 404 for invalid', (done) => {
    request(app)
    .get(`/todos/123`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  })
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      var hexId = todos[1]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err){
          console.log(err);
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e)=>{
            done(e);
          });
      })
    });

    it('should fail to remove todo beacuse different creator', (done) => {
      var hexId = todos[0]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
            expect(todo).toExist();
            done();
          }).catch((e)=>{
            done(e);
          });
      })
    });
});
describe('DELETE /todos/:id', () => {
  it('should return 404 todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  })
});

describe('DELETE /todos/:id', () => {
  it('should return 404 for invalid', (done) => {
    request(app)
    .delete(`/todos/123`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  })
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = "this is new text";

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done);
    });
    it('should not update a todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = "this is new text";

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed:true,
        text
      })
      .expect(404)
      .end(done);
    });
});


describe('PATCH /todos/:id', () => {
    it('should clear completedAt when todo is not completed', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = "this is new text";

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed:false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toNotExist()
      })
      .end(done);
    });
});

describe('get /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString())
          expect(res.body.email).toBe(users[0].email)
      })
      .end(done);
  })
  it('should return 401 if wrong token', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
          expect(res.body).toEqual({})
      })
      .end(done);
  })
});

describe('POST /users', ()=>{
  it('should create a user', (done) => {
    var email = "aegeg@gmail.com"
    var password = '123123'
    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((e)=> done(e));
    })
  });

  it('should return validation errors if request invalid', (done) => {
    var email = "aegeg"
    var password = ''
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
      var email = users[0].email
      var password = '424234234'
      request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});


describe('POST /users/login', ()=>{
  it('should login user and return auth token', (done) => {
      request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist()
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    })

                    done()
                }).catch((e) => done(e))
            })
    })

  it('should reject invalid login', ()=>{
    request(app)
          .post('/users/login')
          .send({
              email: users[1].email,
              password: users[1].password + '1'
          })
          .expect(400)
          .expect((res) => {
              expect(res.headers['x-auth']).toNotExist()
          })
          .end((err, res) => {
              if(err) {
                  return done(err)
              }

              User.findById(users[1]._id).then((user) => {
                  expect(user.tokens.length).toBe(1);
                  done()
              }).catch((e) => done(e))
          })
  })
});


describe('DELETE /users/me/token', ()=>{
  it('should remove auth token on logout', (done)=>{
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=> done(e));
      })
  });
});
