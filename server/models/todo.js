var mongoose = require('mongoose');

var Todo = mongoose.model("Todo",{
  text: {
    type: String,
    required: true,
    minlength: 3,
    trim:true
  },
  completed:{
    type: Boolean,
    default: true
  },
  completedAt: {
    type: Number,
    default:null
  },
  _creator:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  }
});

// var newTodo = new Todo({
//   text:"   edit video    ",
//   completed: false,
//   completedAt: 123
// });
//
// newTodo.save().then((doc) => {
//   console.log(Json.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log("unable to save todo ", e);
// });

module.exports = {
  Todo
}
