const express = require('express');
const mysql =require('mysql');
const dbOption = require('../models/Option_DB');

const router=express.Router();


router.get('/',(req,res)=>{
    const dbCon = mysql.createConnection(dbOption);

    dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });

    const query= `select * from web_portfolio1.ground_list`;


    dbCon.query(query, (err,data)=>{
        if(err){
            console.log('table name:ground_list / Error: select query Error : ',err);
            //console.log(data); //undefined
        }
        else{
            console.log('table name:ground_list / Result: query Success');
            //console.log(data);
                    
        }
        console.log(data);
        
        
        dbCon.end();
        console.log(data[0].ground_img_name);
        res.render('reservation',{id:'',groundList:data});
    });
 });





 module.exports=router;