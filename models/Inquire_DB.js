const connectionDB= require('../models/connection_DB.js');

function save(userName,phoneNumber,content,infoCheck){
    const dbCon=connectionDB.connectDB();

    const query= `INSERT INTO web_portfolio1.inquire(name, phone, content, privacy_check) 
    VALUES('${userName}', '${phoneNumber}', '${content}', '${infoCheck}')`;

    dbCon.query(query, function(err,data){
        if(err){
            console.log('table name:inquire / Error: insert query Error : ',err);
        }
        else{
            console.log('table name:inquire / Result: insert Success');
            console.log(data);
            
        }
        dbCon.end();
    });
}

module.exports={
    save
};