const mysql=require('mysql');
require('dotenv').config();


function connectDb(){
	const dbCon = mysql.createConnection(dbOption);
	dbCon.connect((err)=>{
        if(err!==null)
            console.log(`Error: DB Connect fail: ` ,err);
        else
            console.log('DB Connect Success');
    });
}


module.exports = {
	//connectDB,
	host: process.env.DB_IP,
	user: process.env.DB_USER,
	password : process.env.DB_PASSWORD,
	port	:process.env.DB_PORT,
	database	:process.env.DB_DATABASE,
	

};



