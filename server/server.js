const express=require('express');
const bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose.js');
var {Todo}=require('./models/todo.js');
var {User}=require('./models/user.js');

var app=express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    console.log(req.body);
    var todo=new Todo({
        text : req.body.text
    });
    todo.save().then((doc)=>{
    res.send(doc);
    },(e)=>{
    res.status(400).send(e);
    })
})

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos}),
        (e)=>{response.status(400).send(e);}
    }) 
})



app.listen(3000,()=>{
    console.log("at port");
});

module.exports = app;

// var newTodo= new Todo({
//     text:'cooked food', completed:true,completedAt:1000
// })

// newTodo.save().then((doc)=>{
//     console.log('saved to do',doc)
// },(e)=>{
//     console.log("error")
// })


// var newUser=new User({
//     name:"himanshu",
//     email:"himanshu@gmail.com"
// })
// newUser.save().then(
//     (doc)=>{
//         console.log(doc)
//     },(error)=>{
//         console.log("some error",error)
//     })