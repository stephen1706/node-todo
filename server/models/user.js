var mongoose = require('mongoose');

var User = mongoose.model("User",{
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim:true
  }
});

// var newUser = new User({
//   email:"  stephen@gmail.com   "
// });
// newUser.save().then((doc) => {
//   console.log("user saved",doc);
// }, (e) => {
//   console.log("unable to save todo ", e);
// });

module.exports = {
  User
}
