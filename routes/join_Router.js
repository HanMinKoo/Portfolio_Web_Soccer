const express = require('express');
const crypto = require('crypto');

const router = express.Router();
const userDb = require('../models/join_DB.js');

router.get('/',(req,res)=>{
    console.log('join page Render');
    res.render('join');
});
router.post('/progress', (req,res)=>{
    console.log(req.body);
    crypto.pbkdf2(req.body.userPassword1,'m9m9',8080,64,'sha512',(err,key)=>{
        console.log(key.toString('base64'));
        let password=key.toString('base64');
        userDb.saveUser(req.body.userName,req.body.userEmail,password,res);
    });
});

module.exports=router;