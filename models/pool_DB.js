const mysql = require('mysql');

function connectDB(){
    
  const pool=mysql.createPool({
      host: process.env.DB_IP,
      user: process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      port	:process.env.DB_PORT,
      database	:process.env.DB_DATABASE,
  });
  pool.getConnection((err,connection)=>{
    if(err){
      console.log(err);
      return;
    }
    
    
  });

}
connectDB();