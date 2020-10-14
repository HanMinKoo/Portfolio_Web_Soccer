const mysql = require('mysql');

function connectPoolDB(){
    
  // const pool = mysql.createPool({
  //   host: process.env.DB_IP,
  //   user: process.env.DB_USER,
  //   password : process.env.DB_PASSWORD,
  //   port	:process.env.DB_PORT,
  //   database	:process.env.DB_DATABASE,
  //   connectionLimit: 20
  // });

  return new Promise((resolve,reject)=>{
    resolve(()=>{
      mysql.createPool({
        host: process.env.DB_IP,
        user: process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        port	:process.env.DB_PORT,
        database	:process.env.DB_DATABASE,
        connectionLimit: 20
      });

    });
  });
//   pool.getConnection((err,con)=>{
//     if(err)
//          console.log(err);
//     else
//         console.log("asdasd");
// });
//return pool;
}
module.exports={
  connectPoolDB
}