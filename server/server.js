require('./config/config.js')

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')
const bcrypt = require('bcryptjs');

const express = require('express')
const bodyParser = require('body-parser')

var app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.post('/todos', authenticate, (req,res) => {
  var todo = new Todo({
    text:req.body.text,
    _creator:req.user._id
  })
  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', authenticate, (req,res) => {
  Todo.find({
    _creator:req.user._id
  }).then((todos)=>{
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', authenticate, (req,res) =>{
  var id = req.params.id;

  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }
  Todo.findOne({
      _id:id,
      _creator:req.user.id
  }).then((todo)=>{
    if(!todo){
      return res.status(404).send("not found");
    }
    res.send(todo);
  }, (e) =>{
    return res.status(400).send(e);
  })
});

app.delete('/todos/:id', authenticate, (req, res) => {
  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id:req.params.id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo){
      return res.status(404).send("not found");
    }
    res.send(todo);
  }).catch((e) => {
    return res.status(400).send(e);
  });
});

app.patch('/todos/:id', authenticate, (req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']);//seleksi field yg mau diambil
  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }

  console.log(body);
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id:id,
    _creator:req.user.id
  }, {$set:body}, {new:true}).then((todo) => {
    if(!todo){
      res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
})

app.post('/users', (req,res) => {
  var body = _.pick(req.body, ['email','password']);//seleksi field yg mau diambil

  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
    // res.send(user)
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e) => {
    res.status(400).send(e)
  })
});


app.get('/users/me', authenticate, (req,res)=>{
  res.send(req.user);//authenticate ini ngemodif isi request
});

app.post('/users/login', (req,res) => {
  var body = _.pick(req.body, ['email','password']);//seleksi field yg mau diambil

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e)
  })
});

app.delete('/users/me/token', authenticate, (req,res) =>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log("started on port", port);
})


module.exports = {app}
