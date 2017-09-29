const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
var password="123abc";
bcrypt.genSalt(10,(error,salt)=>{
    bcrypt.hash(password,salt,(error,hash)=>{
        console.log(hash);
    })
})
var hashedpassword='$2a$10$IIKyw3fkwNl2T5JfS8vcauFdJBE/ToVjn9.ChS/zgcyejiRe8hFem';
bcrypt.compare(password,hashedpassword,(err,res)=>{
    console.log(res);
})

var msg="hi there";
var data={
    id:10
};
var hash=SHA256(msg).toString();
var token=jwt.sign(data,'123abc');
var decoded=jwt.verify(token,'123abc');
//console.log(token);
//console.log(decoded);
//console.log(msg, hash);