const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const config=require('./../config/config.js')
const _ = require('lodash');
const bcrypt=require('bcryptjs');
var UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:1,
        trim:true,       
    },
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:"{value} is not valid email"
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON= function(){
    var user=this;
    var userObject=user.toObject();
    return _.pick(userObject,['_id','name','email']);
}

UserSchema.methods.generateAuthToken = function(){
    console.log(user)
    var user=this;
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    })
}

UserSchema.statics.findByToken=function (token){
    var User=this;
    var decoded;
    try{
        decoded=jwt.verify(token,process.env.JWT_SECRET)
    }
    catch(e){
        return new Promise((resolve,reject)=>{
            reject();
        })
    }
    return User.findOne({
        _id : decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}

UserSchema.methods.removeToken=function(token){
    var user=this;
    user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    })
}


UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(error,salt)=>{
            bcrypt.hash(user.password,salt,(error,hash)=>{
               user.password=hash;
               next();
            })
        })
    }
    else{
        next();
    }
})
var User = mongoose.model('User',UserSchema);
module.exports = {User};