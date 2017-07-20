const {MongoClient, ObjectID} = require('mongodb')
//artinya const ObjectID = require('mongodb').ObjectID
// const MongoClient = require('mongodb').MongoClient;

// var user = {name:'andrew',age:25};
// var {age} = user;//artinya var age = user.age
// console.log(age);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('unable to connect to mongodb server');
  }
  console.log('connected to mongo db server');
  //
  // db.collection('Todos').insertOne({
  //   text : "something to do",
  //   completed:false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('unable to insert to do', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

    db.collection('Users').insertOne({
      name : "stephen",
      age:24,
      location:"jakarta"
    }, (err, result) => {
      if(err){
        return console.log('unable to insert users', err);
      }
      console.log(result.ops[0]._id.getTimestamp());
    })
  db.close();
});
