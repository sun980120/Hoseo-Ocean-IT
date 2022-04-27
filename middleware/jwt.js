'use strict';

var jwt = require('jsonwebtoken');

function jwtCreate(userData){
  return new Promise(function (resolve, reject) {
      jwt.sign({
        userId: userData.userId,
        userName: userData.userName,
        userEmail: userData.userEmail,
        userRole: userData.userRole
      }, process.env.JWT_SECRET, {
        expiresIn: '30m',
        issuer: 'Conative',
      },function(err,token){
        console.log(token)
        if(err) reject(err)
        else resolve(token)
      });
  })
}
function jwtCreateANDROID(userData){
  return new Promise(function (resolve, reject) {
      jwt.sign({
        userId: userData.userId,
        userName: userData.userName,
        userEmail: userData.userEmail
      }, process.env.JWT_SECRET, {
        expiresIn: '14d',
        issuer: 'Conative',
      },function(err,token){
        if(err) reject(err)
        else resolve(token)
      });
  })
}
function jwtCerti(token){
  return new Promise(function (resolve, reject) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
          console.log("JWT was Expired!")
        }
        if(decoded){
          resolve(decoded);
        }
        else{
          resolve(false);
        }
      });
  })
}

module.exports = {
  jwtCreate,
  jwtCerti,
  jwtCreateANDROID,
};