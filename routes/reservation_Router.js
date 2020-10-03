const express = require('express');
const mysql =require('mysql');
const dbOption = require('../models/Option_DB');
const router = express.Router();

class ReservationQueue{
    constructor(){
        this.year;
        this.month;
        this.day;
        this.time;
        this.clients=[];
    }
    
    addClientenqueue(request){
        let info=null;

        info=this.getClient(soc);
        
        if(info === null){
            info=new ClientInfo(soc);
            
            this.clients.push(info);
            console.log('clients push / clients length', this.clients.length);
            return 0;
        }
        return 1;
        

    }
    removeClientdequeue(){

    }
}
let reservationInfo=new ReservationQueue();



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
router.get('/process',(req,res)=>{//get방식은 url query에 값을 form의 데이터들을 붙여 보내준다.예약과 관련된 날짜만 넘기는거니 괜찮음.
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
        
        
        reservationInfo.addClientenqueue(req);
        
        


        const dbCon=connectDB();
        let groundUseDate=`${req.query.year}년${req.query.month}월${req.query.day}일`;

        let query=`select * from web_portfolio1.ground_reservation_list where ground_number=${req.query.groundNumber} and ground_use_date='${groundUseDate}' and ground_use_time='${req.query.groundTime}'`;

        dbCon.query(query, (err,data)=>{ //ground_number(운동장 번호와) 예약날짜, 예약시간이 이미 db에 있는지 조회
            if(err)
                console.log('table name:ground_reservation_list / Error: select query Error : ',err);
            else
                console.log('table name:ground_reservation_list / Result: selectquery Success');

            console.log(data[0]);
            if(data[0]===undefined){//예약 안되어있으면 예약 진행
                query = `insert into web_portfolio1.ground_reservation_list(user_id,ground_number,ground_use_date,ground_use_time) values('${req.session.userId}',${req.query.groundNumber},'${groundUseDate}','${req.query.groundTime}')`;

                dbCon.query(query, (err,data2)=>{ //ground_number에 맞는 timetable DB불러오기
                    if(err)
                        console.log('table name:ground_reservation_list / Error: insert query Error : ',err);
                    else
                        console.log('table name:ground_reservation_list / Result: insert query Success');

                    //console.log(data2);
                    res.redirect('/');
                });
            }
            else{ //예약되어있으면 session을 통해 alert출력 / 또는 에러페이지만 새로 만들기
                res.render('exception',{exception:'이미 예약된 시간입니다.'});
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

            if(req.session.userId===undefined) //만약 로그인이 안되어있으면, 운동장 상세 예약 현황 못봄
                res.render('exception',{exception:'예약 현황은 로그인 사용자만 이용할 수 있습니다.'});
            else{
                query=`select ground_time from web_portfolio1.ground_timetable where ground_number=${data[req.query.number-1].ground_number}`;
                
                dbCon.query(query, (err,data2)=>{ //ground_number에 맞는 timetable DB불러오기
                    if(err)
                        console.log('table name:ground_timetable / Error: select query Error : ',err);
                    else
                        console.log('table name:ground_timetable / Result: query Success');

                    //console.log(data2);
                
                    if(req.session.year!==undefined){   //year가 undefined면 날짜 변경이 안됐다는거임. /process에서 session 에 year,month,day넣는작업진행.
                
                        let date= `${req.session.year}년${req.session.month}월${req.session.day}일`;
                        query=`select * from ground_reservation_list where ground_number=${data[req.query.number-1].ground_number} 
                        and ground_use_date='${date}'`;

                        dbCon.query(query, (err,reservationList)=>{ //ground_number에 맞는 timetable DB불러오기
                            if(err)
                                console.log('table name:ground_reservation_list / Error: select query Error : ',err);
                            else
                                console.log('table name:ground_reservation_list / Result: query Success');

                            console.log(`${req.session.year}년${req.session.month}월${req.session.day}일 예약현황`);
                            console.log(reservationList);

                            if(reservationList[0]===undefined)//만약 날짜별 예약 시간이 1개라도 없으면
                                reservationList[0]={ground_use_time:'모든 시간 예약 가능'};

                            console.log(reservationList[0]);
                            res.render('reservation_detail',{id:req.session.userId, groundList:data[req.query.number-1], groundTimeTable:data2, reservationList:reservationList});

                            dbCon.end(); 
                        });
                        
                    }
                    //query=`select * from ground_reservation_list where ground_number=${data[req.query.number-1].ground_number}`;
                    
                    //query number(운동장 번호)에 해당하는 data값 불러오기
                    // //query number에 해당하는 ground_number의 값들을 db조회해서 값 불러오는거는 반복된 작업이기 때문에 지양.
                });
            } 
        }    
                
    });
 });





 module.exports=router;