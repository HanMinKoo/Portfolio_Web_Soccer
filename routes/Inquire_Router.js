const express = require('express');
const nodemailer = require('nodemailer');

const inquireDB= require('../models/Inquire_DB');

const router = express.Router();
require('dotenv').config();

router.post('/',(req,res)=>{
    return ((req.session.account!==undefined)? res.render('inquire',{account:req.session.account}) :res.render('inquire',{account:''}));
});
router.post('/process', (req, res, next)=> {
    //console.log(req);
    
    let userName=req.body.userName;
    let phoneNumber=req.body.phoneNumber;
    let content=req.body.content;
    let infoCheck='OK';

    let transporter = nodemailer.createTransport({ 
        service:'naver',
        auth:{
            user: process.env.INQUIRE_SEND_EMAIL_ID,
            
            pass:process.env.INQUIRE_SEND_EMAIL_PW
        }
    });
    
    let mailOption = {
        from: process.env.INQUIRE_SEND_EMAIL_ID,
        to:   process.env.INQUIRE_RECEIVE_EMAIL_ID,
        subject: `${userName}님으로부터 문의가 들어왔습니다.`,
        text: `내용: ${content} \n\n 휴대폰 번호: ${phoneNumber} \n\n 개인정보 동의: ${infoCheck}`,   
    };

    
    console.log(transporter);
    transporter.sendMail(mailOption, (err,info)=>{

        if(err){
            console.log('Email Sent Error: ',err);         
        }
        else{
            console.log('Email sent Success: ' , info.response);
            inquireDB.save(userName,phoneNumber,content,infoCheck);  
            transporter.close();
        }
    });
    res.redirect('/');
});

module.exports = router;
