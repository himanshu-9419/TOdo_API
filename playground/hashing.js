const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
var msg="hi there";
var data={
    id:10
};
var hash=SHA256(msg).toString();
var token=jwt.sign(data,'123abc');
var decoded=jwt.verify(token,'123abc');
console.log(token);
console.log(decoded);
//console.log(msg, hash);