const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var password = '123abc';

// bcrypt.genSalt(10, (err,salt)=>{//10 itu roundnya
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// })

var hashedPassword = "$2a$10$sg1iD64qK4lGnJoGVeDofeNfArslqwEoO6yVaWXI7EGwdY413aLp.";
bcrypt.compare(password, hashedPassword, (err,res)=>{
  console.log(res);
})

// var data = {
//   id:10
// }
// var token = jwt.sign(data,'123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var message = 'i am user number 3';
// var hash = SHA256(message).toString();
//
// var data = {
//   id:4
// }
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'SOMESECRET').toString()
// }
