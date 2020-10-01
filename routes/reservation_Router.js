const express = require('express');
const mysql =require('mysql');
const dbOption = require('../models/Option_DB');
const router = express.Router();


function connectDB(){
    const dbCon = mysql.createConnection(dbOption);
    
    dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });

    return dbCon;
}
router.get('/process',(req,res)=>{
    console.log("운동장번호",req.query);

    if(req.query.groundTime===undefined){ //날짜 변경에 일치하는 예약 현황 출력 해주기위한 작업
        let querySplit=req._parsedUrl.query.split('&');
        let date=[];
        
        for(let i=0; i<querySplit.length; i++){
            let tmp=querySplit[i].split('=');
            date[i]=tmp[1];
        }
        //console.log(date);
        req.session.year=date[0];
        req.session.month=date[1];
        req.session.day=date[2];
       
       res.redirect(req.headers.referer);  // req.headers.referer은 이전페이지, 즉 http://localhost/reservation?number=1
    }
    else if(req.query.groundTime!==undefined && req.session.userId!==undefined){ //운동장 시간 체크, 로그인상태
        
        const dbCon=connectDB();
        let groundUseDate=`${req.query.year}년${req.query.month}월${req.query.day}일`;

        let query=`select * from web_portfolio1.ground_reservation_list where ground_number=${req.query.groundNumber} and ground_use_date='${groundUseDate}' and ground_use_time='${req.query.groundTime}'`;

        dbCon.query(query, (err,data)=>{ //ground_number에 맞는 timetable DB불러오기
            if(err)
                console.log('table name:ground_reservation_list / Error: select query Error : ',err);
            else
                console.log('table name:ground_reservation_list / Result: selectquery Success');

            console.log(data[0]);
            if(data[0]===undefined){
                query = `insert into web_portfolio1.ground_reservation_list(user_id,ground_number,ground_use_date,ground_use_time) values('${req.session.userId}',${req.query.groundNumber},'${groundUseDate}','${req.query.groundTime}')`;

                dbCon.query(query, (err,data2)=>{ //ground_number에 맞는 timetable DB불러오기
                    if(err)
                        console.log('table name:ground_timetable / Error: select query Error : ',err);
                    else
                        console.log('table name:ground_timetable / Result: query Success');

                    //console.log(data2);
                    res.redirect('/');
                });
            }
            else{ //예약되어있으면 session을 통해 alert출력 / 또는 에러페이지만 새로 만들기

            }
        });
    }
    else if(req.query.groundTime!==undefined && req.session.userId===undefined){//운동장 시간 체크 but 비로그인 상태

    } 
});
router.get('/',(req,res)=>{
    console.log("query=", req.query);
    console.log("session=", req.session);
    
    const dbCon=connectDB();

    /*일단은 주석. db에러 뜨면 이거 다시 살리기 */
    // const dbCon = mysql.createConnection(dbOption);
    
    // dbCon.connect((err)=>{
    //     if(err!==null)
    //         console.log(`Error: DB Connect fail: ` ,err);
    //     else
    //         console.log('DB Connect Success');
    // });

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
       // console.log(data);
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
              
                if(req.session.year!==undefined){   //year가 undefined면 날짜 변경이 안됐다는거임. /process에서 headers 에 query넣는작업진행.
               
                    let date= `${req.session.year}년${req.session.month}월${req.session.day}일`;
                    query=`select * from ground_reservation_list where ground_number=${data[req.query.number-1].ground_number} 
                    and ground_use_date='${date}'`;


                    dbCon.query(query, (err,data3)=>{ //ground_number에 맞는 timetable DB불러오기
                        if(err)
                            console.log('table name:ground_reservation_list / Error: select query Error : ',err);
                        else
                            console.log('table name:ground_reservation_list / Result: query Success');

                        console.log('ㅁㄴㅇㅁㄴㅇㅁㄴㅇ',data3);

                        if(data3[0]===undefined){

                        }
                        dbCon.end(); 
                    });
                    
                }
                //query=`select * from ground_reservation_list where ground_number=${data[req.query.number-1].ground_number}`;

                if(req.session.userId!==undefined)
                {
                    res.render('reservation_detail',{id:req.session.userId, groundList:data[req.query.number-1], groundTimeTable:data2});
                //query number(운동장 번호)에 해당하는 data값 불러오기
                //query number에 해당하는 ground_number의 값들을 db조회해서 값 불러오는거는 반복된 작업이기 때문에 지양.
                }
                else
                    res.render('reservation_detail',{id:'', groundList:data[req.query.number-1],groundTimeTable:data2});
            }); 
        }    
                
    });
 });





 module.exports=router;