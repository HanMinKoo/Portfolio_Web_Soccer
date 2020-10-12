const express = require('express');
const connectionDB= require('../models/connection_DB.js');
const pool= require('../models/pool_DB.js');
const router = express.Router();


router.post('/process',(req,res)=>{//get방식은 url query에 값을 form의 데이터들을 붙여 보내준다.예약과 관련된 날짜만 넘기는거니 괜찮음.
    console.log("정말정말??", req.body);

    const dbCon=connectionDB.connectDB();

    const ground_id=req.body.ground_id;
    const use_date = `${req.body.year}년${req.body.month}월${req.body.day}일`;
    

    /*****운동장 시간 대를 선택 안했을 경우, 즉 날짜만 변경했을 경우******/
    if(req.body.groundTime===undefined){
 
        query=`select * from ground_reservation_list where ground_id=${ground_id} 
                        and use_date='${use_date}'`;

        dbCon.query(query, (err,reservationTimeList)=>{ //ground_ud에 맞는 timetable DB불러오기
            if(err)
                console.log('table name:ground_reservation_list / Error: select query Error : ',err);
            else
                console.log('table name:ground_reservation_list / Result: query Success');

            console.log(reservationTimeList);

            let data=[];
            for(let i=0; i<reservationTimeList.length; i++){
                let tmp={time:reservationTimeList[i].use_time}
                data[i]=tmp;
            }
            
            if(data.length===0){//선택한 날짜의 예약 현황이 한개도 없는 경우
                let data=[{time:'모든 시간 예약 가능'}];
                res.send(data);
            }
            else
                res.send(data);
        });
    }

    /*****로그인 상태에서 운동장 시간을 선택했을 경우, 즉 다 선택 후 예약하기 버튼 눌렀을 때******/
    else if(req.body.groundTime!==undefined && req.session.account!==undefined){ //운동장 시간 선택했는지, 로그인상태 , 즉 완벽한   




        //******트랜잭션 적용 *****/
        const conn=await pool.getConnection();






        //******트랜잭션 미적용 *****/
        // const dbCon=connectionDB.connectDB();
    
        // let query=`select * from web_portfolio1.ground_reservation_list where ground_id=${ground_id} and use_date='${use_date}' and use_time='${req.body.groundTime}'`;

        // dbCon.query(query, (err,data)=>{ //ground_number(운동장 번호와) 예약날짜, 예약시간이 이미 db에 있는지 조회
        //     if(err)
        //         console.log('table name:ground_reservation_list / Error: select query Error : ',err);
        //     else
        //         console.log('table name:ground_reservation_list / Result: selectquery Success');

        //     //console.log(data[0]);
        //     if(data[0]===undefined){//예약 안되어있으면 예약 진행
        //         query = `insert into web_portfolio1.ground_reservation_list(user_id,ground_id,use_date,use_time) values('${req.session.user_id}',${ground_id},'${use_date}','${req.body.groundTime}')`;

        //         dbCon.query(query, (err,data2)=>{ //ground_number에 맞는 timetable DB불러오기
        //             if(err)
        //                 console.log('table name:ground_reservation_list / Error: insert query Error : ',err);
        //             else
        //                 console.log('table name:ground_reservation_list / Result: insert query Success');

        //             //console.log(data2);
        //             res.redirect('/');
        //         });
        //     }
        //     else{ //예약되어있으면 session을 통해 alert출력 / 또는 에러페이지만 새로 만들기
        //         res.render('exception',{exception:'이미 예약된 시간입니다.'});
        //     }
        // });
    }

    /*****운동장 시간 체크 but 비로그인 상태, 즉 비정상적 접근 ******/
    else if(req.query.groundTime!==undefined && req.session.account===undefined)
        res.render('exception',{exception:'비정상적 접근입니다. 로그인 후 이용하세요.'});
     
});
router.get('/',(req,res)=>{
    console.log("query=", req.query);
    console.log("session=", req.session);
    
    const dbCon=connectionDB.connectDB();

    let query= `select * from web_portfolio1.ground`;

    dbCon.query(query, (err,groundInfo)=>{
        if(err)
            console.log('table name:ground / Error: select query Error : ',err);
        else
            console.log('table name:ground / Result: select query Success');
                    
        
        //console.log(groundInfo);
        

        /*****운동장 리스트 페이지*****/
        if(req.query.number===undefined){  
            if(req.session.account!==undefined)
                res.render('reservation',{account:req.session.account,groundList:groundInfo});
            else
                res.render('reservation',{account:'',groundList:groundInfo});
        }

        /*****운동장 예약 페이지*****/
        else{
            if(req.session.account===undefined) //만약 로그인이 안되어있으면, 운동장 상세 예약 현황 못봄
                res.render('exception',{exception:'예약 현황은 로그인 사용자만 이용할 수 있습니다.'});
            else{
                query=`select ground_time from web_portfolio1.ground_time_list where ground_id=${groundInfo[req.query.number-1].id}`;
                
                dbCon.query(query, (err,data2)=>{ //ground_id에 맞는 timetable DB불러오기
                    if(err)
                        console.log('table name:ground_time_list / Error: select query Error : ',err);
                    else
                        console.log('table name:ground_timetable / Result: query Success');
               

                    res.render('reservation_detail',{account:req.session.account, groundList:groundInfo[req.query.number-1], groundTimeTable:data2, reservationList:''});
                });
            } 
        }              
    });
 });





 module.exports=router;