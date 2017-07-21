const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
Todo.findOneAndRemove({
  _id:'59707c8fcf0d6921bc89aed5'
}).then((result) => {
  console.log(result);
});

Todo.findByIdAndRemove('59707c8fcf0d6921bc89aed5').then((todo) => {
  console.log(todo);
})
