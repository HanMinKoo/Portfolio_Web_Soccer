const mysql =require('mysql');
const dbOption = require('./Option_DB');

function loginUser(userEmail, userPassword,callback){
    const dbCon = mysql.createConnection(dbOption);

    dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });

    const query= `select user_name from web_portfolio1.user where user_email='${userEmail}' and user_password='${userPassword}'`;


    dbCon.query(query, (err,data)=>{
        if(err){
            console.log('table name:user / Error: select query Error : ',err);
            console.log(data); //undefined
        }
        else{
            console.log('table name:user / Result: query Success');
            
            console.log(data[0]); //undefined면
            
        }
        if(data[0]===undefined) //해당 email password를 쿼리로 못찾았을 경우
            callback('fail'); 
        else
          callback('success');
        
        dbCon.end();
    });
}

module.exports={
    loginUser
}