//var MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    var data=db.collection('Todos').find().toArray().then((docs)=>{
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log("error occured"+err);
    });
})


// MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
//     if(err) {console.log("unable to connect to database server"); return;}
//     console.log("connection succesfull");
//     db.collection('Todos').insertOne({
//         text:'to do', completed:false
//     },(err,result)=>{
//         if(err) console.log("unable to insert");
//         console.log(JSON.stringify(result.ops,undefined,2));
//     })
//     db.close();
// });

// MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
//     if(err) return console.log("unable to connect db");
//     console.log("connection succesfull");
//     db.collection('users').insertOne({
//         name:"himanshu",age:"24",location:"Bangalore"
//     },(err,result)=>{
//         if(err) return console.log("uanebl to insert");
//         console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
//     })
//     db.close();
// })