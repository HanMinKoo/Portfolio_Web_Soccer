const express = require('express');
const crypto = require('crypto');

const router = express.Router();
const joinDB = require('../models/join_DB.js');
const connectionDB= require('../models/connection_DB.js');

router.get('/',(req,res)=>{
    console.log('join page Render');
    res.render('join');
});
router.post('/checkduplication',(req,res)=>{
    console.log("body의 value값",req.body);
    const dbCon=connectionDB.connectDB();
    let query;
    if(req.body.type==='text')
        query=`select * from web_portfolio1.user where account='${req.body.value}'`;
    else if(req.body.type==='email')
        query=`select * from web_portfolio1.user where email='${req.body.value}'`;

    dbCon.query(query, (err,userInfo)=>{
        if(err)
            console.log('table name:user / Error: select query Error : ',err);
        else{
            console.log('table name:user / Result: select query Success');
            console.log(userInfo[0]);
            
            (userInfo[0]===undefined) ? res.send("1") : res.send("0");
        }
        dbCon.end();
    });
});

router.post('/progress', (req,res)=>{
    console.log(req.body);
    crypto.pbkdf2(req.body.userPassword1,'m9m9',8080,64,'sha512',(err,key)=>{
        console.log("base64 인코딩 후 key값:",key.toString('base64'));
        let password=key.toString('base64');
        joinDB.saveUser(req.body.userName,req.body.userEmail,password,res,req.body.userId);
    });
});

module.exports=router;