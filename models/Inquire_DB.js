const mysql =require('mysql');
const dbOption = require('./Option_DB');


function save(userName,phoneNumber,content,infoCheck){
    const dbCon=mysql.createConnection(dbOption);
   
    dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });
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