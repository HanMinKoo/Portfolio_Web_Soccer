const express = require('express');
const router = express.Router();

const connectionDB= require('../models/connection_DB.js');
require('dotenv').config();



router.get('/',(req,res)=>{
    const dbCon=connectionDB.connectDB();

    let query=`select ground_reservation_list.id, name, use_date, ground_reservation_list.use_time, state from ground_reservation_list  left join ground on ground_reservation_list.ground_id = ground.id where user_id=${req.session.user_id} order by id desc` ;

    dbCon.query(query,(err,result)=>{
        if(err)
            console.log('table name:ground_reservation_list / Error: select query Error : ',err);
        else
            console.log('table name:ground_reservation_list / Result: select query Success');

        console.log(result[0]);
        
        if(result[0]===undefined) {
            result[0]={
                text:"예약 현황이 존재하지 않습니다."
            }
        } 
        res.render('mypage',{account:req.session.account, reservationList:result});
    });
});

module.exports=router;