const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('unable to connect to mongodb server');
  }
  console.log('connected to mongo db server');

  // db.collection('Todos').deleteMany({
  //   text: "eat lunch"
  // }).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log("unable to fetch todo", err);
  // });

  // db.collection('Todos').deleteOne({
  //   text: "eat lunch"
  // }).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log("unable to fetch todo", err);
  // });
  db.collection('Todos').findOneAndDelete({
    completed: false
  }).then((result) => {
    console.log(result);
  }, (err) => {
    console.log("unable to fetch todo", err);
  });
  db.close();
});
