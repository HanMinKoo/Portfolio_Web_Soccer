const mysql =require('mysql');
const dbOption = require('./Option_DB');

function saveUser(userName, userEmail, userPassword){
    const dbCon = mysql.createConnection(dbOption);
    dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });

    const query= `INSERT INTO web_portfolio1.user(user_name, user_email,user_password) 
    VALUES('${userName}', '${userEmail}', '${userPassword}')`;

    dbCon.query(query, function(err,data){
        if(err){
            console.log('table name:inquire / Error: insert query Error : ',err);
        }
        else{
            console.log('table name:inquire / Result: insert Success');
            console.log(data);
            dbCon.end();
        }
    });
    
}

module.exports={
    saveUser
}