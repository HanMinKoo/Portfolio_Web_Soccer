const mysql =require('mysql');
const dbOption = require('./Option_DB');

function saveUser(userName, userEmail, userPassword,response,userId){
    
    const dbCon = mysql.createConnection(dbOption);
    dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });

    const query= `INSERT INTO web_portfolio1.user(account, name, email, password) 
    VALUES('${userId}','${userName}', '${userEmail}', '${userPassword}')`;

    dbCon.query(query, function(err,data){
        if(err){
            console.log('table name:user / Error: insert query Error : ',err);
        }
        else{
            console.log('table name:user / Result: insert Success');
            console.log(data);
            response.redirect('/');
        }
        dbCon.end();
    });
    
}

module.exports={
    saveUser
}