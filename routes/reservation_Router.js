const express = require('express');
const mysql =require('mysql');
const dbOption = require('../models/Option_DB');
const router = express.Router();


router.get('/process',(req,res)=>{
    
    console.log(req);
    console.log(req._parsedUrl.query);
    
    if(req.body.groundTime===undefined){
       
       res.redirect(`${req.headers.referer}&${req._parsedUrl.query}`); 
    }
    // else{
    //     let reservationUseDate=`${req.body.year}년${req.body.month}월${req.body.day}일${req.body.groundTime}시`;
    //     console.log(reservationUseDate);
    // }
    
});
router.get('/',(req,res)=>{
    console.log("query=", req.query);
    if(req.query.year!==undefined){   //year가 undefined가 아니라면 month랑 day도 undefined값도 있음무조건
        console.log(req.query.year);
    }
    
    console.log("session=", req.session);
    
    const dbCon = mysql.createConnection(dbOption);
    
    dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });

    let query= `select * from web_portfolio1.ground_list`;


    dbCon.query(query, (err,data)=>{
        if(err)
            console.log('table name:ground_list / Error: select query Error : ',err);
        else
            console.log('table name:ground_list / Result: query Success');
                    
        
        //console.log(data);
        
        //console.log(data[0].ground_use_time);//이러면 만약 운동장 리스트가 100개면 반복문 100번으로 또 split다해야함..
        //그러면 db를 새로 만드느냐?
        //이름, 가격, 위치 다 필요한데.. 그냥 컬럼 하나를 만들자.
        if(req.query.number===undefined){  //운동장 리스트 페이지
            if(req.session.userId!==undefined)
                res.render('reservation',{id:req.session.userId,groundList:data});
            else
                res.render('reservation',{id:'',groundList:data});
        }
        else{//운동장 상세 페이지

            query=`select ground_time from web_portfolio1.ground_timetable where ground_number=${data[req.query.number-1].ground_number}`;
            
            dbCon.query(query, (err,data2)=>{ //ground_number에 맞는 timetable DB불러오기
                if(err)
                    console.log('table name:ground_timetable / Error: select query Error : ',err);
                else
                    console.log('table name:ground_timetable / Result: query Success');

                //console.log(data2);

                //query=`select * from ground_reservation_list where ground_number=${data[req.query.number-1].ground_number}`;

                if(req.session.userId!==undefined)
                {
                    //console.log(data[req.query.number-1]);
                    res.render('reservation_detail',{id:req.session.userId, groundList:data[req.query.number-1], groundTimeTable:data2});
                //query number와 ground_number(pk)값이 동일하게 설계.
                //query number에 해당하는 ground_number의 값들을 db조회해서 값 불러오는거는 반복된 작업이기 때문에 지양.
                }
                else
                    res.render('reservation_detail',{id:'', groundList:data[req.query.number-1],groundTimeTable:data2});
            }); 
        }    
        dbCon.end();         
    });
 });





 module.exports=router;