const express = require('express');
const connectionDB= require('../models/connection_DB.js');
const router = express.Router();

//*****예약 승인, 취소 Router(state값을 통해 승인 또는 취소 선택)*****/
router.post('/',(req,res)=>{
    
    console.log(req.body);
    const db=connectionDB.connectDB();
    const state=req.body.state;
    console.log(state);

    let query;
    if(state==='cancel')
        query= `delete from ground_reservation_list where id=${req.body.id}`;
    else if(state==='approval')
        query= `update ground_reservation_list set state='승인 완료' where id=${req.body.id}`;

    db.query(query,(err,result)=>{
        if(err){
            if(state==='cancel')
                console.log('table name:ground_reservation_list / Error: delete query Error : ',err);
            else if(state==='approval')
                console.log('table name:ground_reservation_list / Error: update query Error : ',err);
        }
        else{
            if(state==='cancel')
                console.log('table name:ground_reservation_list / Result: delete query Success');
            else if(state==='approval')
                console.log('table name:ground_reservation_list / Result: update query Success');
            
            console.log(result);
            res.send('ok');
        }
    });
});

module.exports=router;