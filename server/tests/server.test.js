const expect = require('expect');
const request= require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {//bersihin db dulu seblm test mulai
  Todo.remove({}).then(() => {
    done()
  })
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

      Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
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
          expect(todos.length).toBe(0);
          done();
      }).catch((e) => done(e));
    });
  })
});
