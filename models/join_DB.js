const connectionDB= require('../models/connection_DB.js');

function saveUser(userName, userEmail, userPassword,response,userId){
    const dbCon=connectionDB.connectDB();

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