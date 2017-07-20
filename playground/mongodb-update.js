const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('unable to connect to mongodb server');
  }
  console.log('connected to mongo db server');

  // db.collection('Todos').findOneAndUpdate({
  //   text: "walk the dog"
  // },{
  //   $set:{
  //     completed : false
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log("unable to update", err);
  // });

    db.collection('Users').findOneAndUpdate({
      name: "stephen"
    },{
      $set: {
        name:"joko"
      },
      $inc:{
        age : 1
      }
    },{
      returnOriginal: false
    }).then((result) => {
      console.log(result);
    }, (err) => {
      console.log("unable to update", err);
    });
  db.close();
});
