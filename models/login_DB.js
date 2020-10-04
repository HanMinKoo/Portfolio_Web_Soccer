const mysql =require('mysql');
const dbOption = require('./Option_DB');
const dbTest= require('./test_db');
function loginUser(userId, userPassword,callback){
   // let dbCon=dbTest.connectDB();
    const dbCon = mysql.createConnection(dbOption);

    dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });

    const query= `select account from web_portfolio1.user where account='${userId}' and password='${userPassword}'`;
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
          callback('success',data[0].account);

        dbCon.end();
    });
}

module.exports={
    loginUser
}