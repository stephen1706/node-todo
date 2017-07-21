const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id ='5970763f9c33ce2100fa85ce';

if(!ObjectID.isValid(id)){
  return console.log('id not valid');
}
Todo.find({
  _id: id
}).then((res) => {
  console.log('TODOS', res);
});

Todo.findOne({
  _id: id
}).then((res) => {
  console.log('TODO', res);
});

Todo.findById(id).then((res) => {
  if(!res){
    return console.log('id not found');
  }
  console.log('TODO by id', res);
}).catch((e) => console.log(e));
