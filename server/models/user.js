const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 3,
      trim:true,
      unique: true,
      validate: {
        validator:(value) => {
          return validator.isEmail(value);
        },
        message: '{VALUE} is not a valid email'
      }
    }, password : {
      type : String,
      require:true,
      minlength:6
    }, tokens: [
      {
        access:{
          type : String,
          require:true
        }, token: {
          type : String,
          require:true
        }
      }
    ]
  });

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function () {
  //pake function krn bisa pake this, klo arrow function ()=> ga bs pk this
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access},process.env.JWT_SECRET).toString();
  user.tokens.push({
    access,
    token
  });

  return user.save().then(()=>{
    return token;
  });
}

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(e){
    return Promise.reject();
      // return new Promise((resolve, reject) => {
      //   reject();
      // })
  }

  return User.findOne({
    _id:decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });
}

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;
  return User.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err,res)=>{
        if(res){
          resolve(user);
        } else {
          reject();
        }
      });
    })
  });
};

UserSchema.pre('save', function(next){//dijalanin sebelum save
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        })
      })
  } else {
    next();
  }
});

UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull : {//find and remove token object from tokens array
      tokens: {
        token:token
      }
    }
  })
};

var User = mongoose.model("User", UserSchema);

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
