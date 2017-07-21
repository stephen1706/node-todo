require('./config/config.js')

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

const express = require('express')
const bodyParser = require('body-parser')

var app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.post('/todos', (req,res) => {
  var todo = new Todo({
    text:req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req,res) => {
  Todo.find().then((todos)=>{
    res.send({
      todos
    })
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', (req,res) =>{
  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }
  Todo.findById(req.params.id).then((todo)=>{
    if(!todo){
      return res.status(404).send("not found");
    }
    res.send(todo);
  }, (e) =>{
    return res.status(400).send(e);
  })
});

app.delete('/todos/:id', (req, res) => {
  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(req.params.id).then((todo) => {
    if(!todo){
      return res.status(404).send("not found");
    }
    res.send(todo);
  }).catch((e) => {
    return res.status(400).send(e);
  });
});

app.patch('/todos/:id', (req,res)=>{
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

  Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo) => {
    if(!todo){
      res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
})
app.listen(port, () => {
  console.log("started on port", port);
})
module.exports = {app}
