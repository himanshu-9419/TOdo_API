const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');
const bcrypt=require('bcryptjs')
var {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose.js');
var {Todo}=require('./models/todo.js');
var {User}=require('./models/user.js');
var {authenticate}=require('./middleware/authenticate.js');

const port=process.env.PORT || 3000;

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

app.post('/users/login',(req,res)=>{
    var userDetail=_.pick(req.body,['name','email','password']);
    User.findOne({
        email:userDetail.email
    }).then((user)=>{
        var hashedpassword=user.password;
        console.log(hashedpassword);
        bcrypt.compare(userDetail.password,hashedpassword,(err,result)=>{
            if(err) res.status(401).send(err);
            console.log(result);
            res.header('x-auth',user.tokens[0].token).send(user);
        })
    }).catch((err)=>{
        res.status(401).send(err);
    })
    
})

app.delete('users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    })
})

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo) return res.status(404).send();
        res.send({todo});
    }).catch((err)=>{
        res.status(404).send();
    })
    //res.send(req.params.id + id );
})

app.delete('/todos/:id',(req,res)=>{
    debugger;
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({result:"not fund"});
    }
Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo) {res.status(404).send();}
    else {res.send(todo);}
}).catch((err)=>{ 
    res.status(404).send(err);
}); 
});

app.patch('/todos/:id',(req,res)=>{
    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send({result:"not fund"});
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt=new Date().getTime();
    }
    else {
        body.completedAt=null;
        body.complete=false;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo) res.status(404).send();
        else res.send(todo);
    }).catch((e)=>{
        res.status(404).send();
    });
})


app.post('/users',(req,res)=>{
    debugger;
    var body=_.pick(req.body,['name','email','password']);
    var user=new User(body);
    //console.log("email is"+user.email);
    //console.log("user is"+JSON.stringify(user));
    user.save().then(()=>{
        //console.log("creating token");
        return user.generateAuthToken()    
    }).then((token)=>{
        //console.log("sending token");
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
       // console.log(e);
    res.status(400).send(e);
    });
})



app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
})

app.listen(port,()=>{
    console.log("at port"+port);
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