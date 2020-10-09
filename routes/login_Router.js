const express = require('express');
const crypto = require('crypto');

const router=express.Router();
const loginDB = require('../models/login_DB.js');

router.get('/',(req,res)=>{
   console.log("login page render");
   //console.log(req.session);
   if(req.session.loginText ===true){
        req.session.loginText=null;
        res.render('login',{text:'아이디 또는 비밀번호를 확인해주세요.'});
   }
   else
        res.render('login',{text:''});
});


router.post('/process',(req,res)=>{
    console.log(req.body);
    let password;

    crypto.pbkdf2(req.body.password,'m9m9',8080,64,'sha512',(err,key)=>{
        console.log(key.toString('base64'));
        password=key.toString('base64');
        account=req.body.account;
        loginDB.getUserInfo(account,password,authCheck);
      
    });


    function authCheck(result,account,user_id){
        console.log("result:",result);
        

        if(result==='fail'){
            req.session.loginText=true; //session 객체에 loginText 속성만들어줘서 loginText값을 통해 아이디 비밀번호 확인하라는 문구 출력
            //console.log(req.session);
            
            res.redirect('/login'); //render로하면 css가 안먹는다.
        }
        else //result ==='success'
        {
            req.session.isLogined=true;
            req.session.account=account;
            req.session.user_id=user_id;
    
            console.log("req.session",req.session);
            req.session.save(()=>{
                console.log('session save success');
                res.redirect('/');
            });  
        }
    }
 });

 module.exports=router;