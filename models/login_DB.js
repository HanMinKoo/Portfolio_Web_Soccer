const connectionDB= require('../models/connection_DB.js');

function getUserInfo(account, password,callback){
    const dbCon=connectionDB.connectDB();

    const query= `select account,id from web_portfolio1.user where account='${account}' and password='${password}'`;
    dbCon.query(query, (err,data)=>{
        
        if(err){
            console.log('table name:user / Error: select query Error : ',err);
            console.log(data); //undefined
        }
        else{
            console.log('table name:user / Result: query Success');
            console.log("asdasdasdasd",data[0]); //undefined면
        }
        if(data[0]===undefined) //db에서 id password를 쿼리로 못찾았을 경우
            callback('fail'); 
        else
          callback('success',data[0].account,data[0].id);

        dbCon.end();
    });
}

module.exports={
    getUserInfo
}